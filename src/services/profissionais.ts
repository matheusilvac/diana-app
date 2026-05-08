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
  return [...seed, ...stored]
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

