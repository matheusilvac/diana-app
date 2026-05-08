"use client"

import { services as seedServices } from "@/lib/mocks"

export type Service = (typeof seedServices)[number]

export type CreateServiceInput = {
  slug: string
  name: string
  category: string
  durationMinutes: number
  price: number
}

const storageKey = (slug: string) => `diana:${slug}:services`

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function formatDuration(minutes: number) {
  return `${minutes} min`
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

export async function getServices(slug: string): Promise<Service[]> {
  if (typeof window === "undefined") return seedServices
  const stored = safeParse<Service[]>(window.localStorage.getItem(storageKey(slug))) ?? []
  return [...seedServices, ...stored]
}

export async function createService(input: CreateServiceInput): Promise<Service> {
  const { slug, name, category, durationMinutes, price } = input
  const all = await getServices(slug)
  const nextId = all.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1

  const service: Service = {
    id: nextId,
    name,
    duration: formatDuration(durationMinutes),
    price: formatPrice(price),
    category,
    status: "Ativo",
  }

  if (typeof window !== "undefined") {
    const stored = safeParse<Service[]>(window.localStorage.getItem(storageKey(slug))) ?? []
    window.localStorage.setItem(storageKey(slug), JSON.stringify([service, ...stored]))
  }

  return service
}

