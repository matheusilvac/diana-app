"use client"

import { professionals as seedProfessionals } from "@/lib/mocks"

export type Professional = {
  id: number
  name: string
  avatar: string
  specialties: string[]
  schedule: {
    days: string[]
    start: string
    end: string
  }
  status: "Ativo" | "Inativo"
  attendancesCount: number
  rating: number
}

export type CreateProfessionalInput = {
  slug: string
  name: string
  avatar?: string
  specialties: string[]
  schedule: {
    days: string[]
    start: string
    end: string
  }
}

const storageKey = (slug: string) => `diana:${slug}:professionals`
const deletedKey = (slug: string) => `diana:${slug}:professionals:deleted`

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function mapSeed(): Professional[] {
  return seedProfessionals.map((p) => ({
    id: Number(p.id),
    name: p.name,
    avatar: p.avatar,
    specialties: [p.role],
    schedule: { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], start: "08:00", end: "18:00" },
    status: "Ativo",
    attendancesCount: 124,
    rating: 4.9,
  }))
}

export async function getProfessionals(slug: string): Promise<Professional[]> {
  const seed = mapSeed()
  if (typeof window === "undefined") return seed
  const stored = safeParse<Professional[]>(window.localStorage.getItem(storageKey(slug))) ?? []
  const deleted = safeParse<number[]>(window.localStorage.getItem(deletedKey(slug))) ?? []

  const map = new Map<number, Professional>()
  for (const p of seed) map.set(p.id, p)
  for (const p of stored) map.set(p.id, p)
  for (const id of deleted) map.delete(id)

  return Array.from(map.values()).sort((a, b) => b.id - a.id)
}

export async function createProfessional(input: CreateProfessionalInput): Promise<Professional> {
  const { slug, name, avatar, specialties, schedule } = input
  const all = await getProfessionals(slug)
  const nextId = all.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1

  const professional: Professional = {
    id: nextId,
    name,
    avatar: avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
    specialties,
    schedule,
    status: "Ativo",
    attendancesCount: 0,
    rating: 5.0,
  }

  if (typeof window !== "undefined") {
    const stored = safeParse<Professional[]>(window.localStorage.getItem(storageKey(slug))) ?? []
    window.localStorage.setItem(storageKey(slug), JSON.stringify([professional, ...stored]))
  }

  return professional
}

export async function getProfessionalById(slug: string, id: number): Promise<Professional | null> {
  const all = await getProfessionals(slug)
  return all.find((p) => p.id === id) ?? null
}

export async function updateProfessional(
  slug: string,
  id: number,
  patch: Pick<Professional, "name" | "avatar" | "specialties" | "schedule">
): Promise<Professional> {
  const existing = await getProfessionalById(slug, id)
  const next: Professional = {
    id,
    name: patch.name,
    avatar: patch.avatar,
    specialties: patch.specialties,
    schedule: patch.schedule,
    status: existing?.status ?? "Ativo",
    attendancesCount: existing?.attendancesCount ?? 0,
    rating: existing?.rating ?? 5.0,
  }

  if (typeof window !== "undefined") {
    const stored = safeParse<Professional[]>(window.localStorage.getItem(storageKey(slug))) ?? []
    const without = stored.filter((p) => p.id !== id)
    window.localStorage.setItem(storageKey(slug), JSON.stringify([next, ...without]))

    const deleted = safeParse<number[]>(window.localStorage.getItem(deletedKey(slug))) ?? []
    if (deleted.includes(id)) {
      window.localStorage.setItem(deletedKey(slug), JSON.stringify(deleted.filter((x) => x !== id)))
    }
  }

  return next
}

export async function deleteProfessional(slug: string, id: number): Promise<void> {
  if (typeof window === "undefined") return

  const stored = safeParse<Professional[]>(window.localStorage.getItem(storageKey(slug))) ?? []
  const nextStored = stored.filter((p) => p.id !== id)
  window.localStorage.setItem(storageKey(slug), JSON.stringify(nextStored))

  const deleted = safeParse<number[]>(window.localStorage.getItem(deletedKey(slug))) ?? []
  if (!deleted.includes(id)) {
    window.localStorage.setItem(deletedKey(slug), JSON.stringify([id, ...deleted]))
  }
}

