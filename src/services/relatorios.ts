"use client"

import { professionals as seedProfessionals, services as seedServices } from "@/lib/mocks"

export type SalesEvent = {
  id: number
  date: string
  professionalId: number
  amount: number
}

export type Period = "mes" | "3meses" | "ano"

export type SeriesPoint = {
  label: string
  count: number
  amount: number
}

export type ProfessionalSummary = {
  professionalId: number
  name: string
  role: string
  avatar: string
  count: number
  amount: number
}

export type SalesReport = {
  period: Period
  startDate: string
  endDate: string
  totalCount: number
  totalAmount: number
  averageTicket: number
  series: SeriesPoint[]
  byProfessional: ProfessionalSummary[]
}

const storageKey = (slug: string) => `diana:${slug}:sales`

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function toISODate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function currency(amount: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)
}

function priceFromServiceName(name: string) {
  const found = seedServices.find((s) => s.name.toLowerCase() === name.toLowerCase())
  if (!found) return null
  const num = Number(found.price.replace(/[R$\s.]/g, "").replace(",", "."))
  return Number.isFinite(num) ? num : null
}

function generateSeedSales(slug: string): SalesEvent[] {
  const seed = hashString(slug)
  const rand = mulberry32(seed)
  const today = new Date()
  const start = addDays(today, -365)
  const profs = seedProfessionals
  const basePrices = seedServices.map((s) => priceFromServiceName(s.name)).filter((x): x is number => typeof x === "number")
  const defaultPrice = basePrices.length ? basePrices[Math.floor(rand() * basePrices.length)] : 80

  let id = 1000
  const events: SalesEvent[] = []

  for (let i = 0; i <= 365; i++) {
    const day = addDays(start, i)
    const dow = day.getDay()
    const isWeekend = dow === 0 || dow === 6
    const dailyBase = isWeekend ? 6 : 8
    const variability = rand()
    const count = clamp(Math.round(dailyBase * (0.4 + variability)), 1, 18)

    for (let j = 0; j < count; j++) {
      const professional = profs[Math.floor(rand() * profs.length)]
      const price = (basePrices.length ? basePrices[Math.floor(rand() * basePrices.length)] : defaultPrice) * (0.8 + rand() * 0.6)
      const amount = Math.round(price * 100) / 100
      events.push({
        id: id++,
        date: toISODate(day),
        professionalId: professional.id,
        amount,
      })
    }
  }

  return events
}

export async function getSalesEvents(slug: string): Promise<SalesEvent[]> {
  if (typeof window === "undefined") return generateSeedSales(slug)
  const stored = safeParse<SalesEvent[]>(window.localStorage.getItem(storageKey(slug)))
  if (stored && stored.length > 0) return stored
  const seed = generateSeedSales(slug)
  window.localStorage.setItem(storageKey(slug), JSON.stringify(seed))
  return seed
}

function monthShortPtBR(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00")
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(d).replace(".", "")
}

function groupByMonth(events: SalesEvent[]) {
  const map = new Map<string, { count: number; amount: number }>()
  for (const e of events) {
    const key = e.date.slice(0, 7)
    const prev = map.get(key) ?? { count: 0, amount: 0 }
    map.set(key, { count: prev.count + 1, amount: prev.amount + e.amount })
  }
  return map
}

function groupByWeekOfMonth(events: SalesEvent[], month: string) {
  const buckets = new Map<number, { count: number; amount: number }>()
  for (const e of events) {
    if (e.date.slice(0, 7) !== month) continue
    const d = new Date(e.date + "T00:00:00")
    const w = Math.floor((d.getDate() - 1) / 7) + 1
    const prev = buckets.get(w) ?? { count: 0, amount: 0 }
    buckets.set(w, { count: prev.count + 1, amount: prev.amount + e.amount })
  }
  return buckets
}

export async function getSalesReport(params: {
  slug: string
  period: Period
  professionalId?: number | null
}): Promise<SalesReport> {
  const { slug, period, professionalId } = params
  const all = await getSalesEvents(slug)
  const now = new Date()

  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let start = startOfMonth(end)

  if (period === "3meses") {
    start = new Date(end.getFullYear(), end.getMonth() - 2, 1)
  }
  if (period === "ano") {
    start = new Date(end.getFullYear(), end.getMonth() - 11, 1)
  }

  const startISO = toISODate(start)
  const endISO = toISODate(end)

  const filtered = all.filter((e) => e.date >= startISO && e.date <= endISO && (!professionalId || e.professionalId === professionalId))

  const totalCount = filtered.length
  const totalAmount = Math.round(filtered.reduce((sum, e) => sum + e.amount, 0) * 100) / 100
  const averageTicket = totalCount > 0 ? Math.round((totalAmount / totalCount) * 100) / 100 : 0

  let series: SeriesPoint[] = []

  if (period === "mes") {
    const month = startISO.slice(0, 7)
    const weeks = groupByWeekOfMonth(filtered, month)
    const endMonthISO = toISODate(endOfMonth(new Date(startISO + "T00:00:00")))
    const endWeek = Math.floor((Number(endMonthISO.slice(8, 10)) - 1) / 7) + 1
    series = Array.from({ length: endWeek }).map((_, idx) => {
      const w = idx + 1
      const v = weeks.get(w) ?? { count: 0, amount: 0 }
      return { label: `S${w}`, count: v.count, amount: Math.round(v.amount * 100) / 100 }
    })
  } else {
    const byMonth = groupByMonth(filtered)
    const monthsCount = period === "3meses" ? 3 : 12
    const points: SeriesPoint[] = []
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(end.getFullYear(), end.getMonth() - i, 1)
      const key = toISODate(d).slice(0, 7)
      const v = byMonth.get(key) ?? { count: 0, amount: 0 }
      points.push({
        label: monthShortPtBR(key + "-01"),
        count: v.count,
        amount: Math.round(v.amount * 100) / 100,
      })
    }
    series = points
  }

  const profMap = new Map<number, { count: number; amount: number }>()
  for (const e of filtered) {
    const prev = profMap.get(e.professionalId) ?? { count: 0, amount: 0 }
    profMap.set(e.professionalId, { count: prev.count + 1, amount: prev.amount + e.amount })
  }

  const byProfessional: ProfessionalSummary[] = seedProfessionals
    .map((p) => {
      const v = profMap.get(p.id) ?? { count: 0, amount: 0 }
      return {
        professionalId: p.id,
        name: p.name,
        role: p.role,
        avatar: p.avatar,
        count: v.count,
        amount: Math.round(v.amount * 100) / 100,
      }
    })
    .sort((a, b) => b.amount - a.amount)

  return {
    period,
    startDate: startISO,
    endDate: endISO,
    totalCount,
    totalAmount,
    averageTicket,
    series,
    byProfessional,
  }
}

export function formatReportCurrency(amount: number) {
  return currency(amount)
}

