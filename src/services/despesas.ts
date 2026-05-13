"use client"

export type ExpenseCategory =
  | "Aluguel"
  | "Energia"
  | "Água"
  | "Internet"
  | "Material"
  | "Produtos"
  | "Marketing"
  | "Impostos"
  | "Folha de pagamento"
  | "Outros"

export type ExpenseType = "Fixa" | "Variável"
export type ExpenseStatus = "Paga" | "Pendente"

export type Expense = {
  id: number
  title: string
  category: ExpenseCategory
  type: ExpenseType
  amount: number
  date: string
  status: ExpenseStatus
  recurring: boolean
  notes?: string
}

export type CreateExpenseInput = Omit<Expense, "id"> & { slug: string }

const storageKey = (slug: string) => `diana:${slug}:expenses`

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function seedExpenses(): Expense[] {
  return [
    {
      id: 101,
      title: "Aluguel do salão",
      category: "Aluguel",
      type: "Fixa",
      amount: 2800,
      date: "2024-05-05",
      status: "Paga",
      recurring: true,
      notes: "Vencimento todo dia 05",
    },
    {
      id: 102,
      title: "Conta de energia",
      category: "Energia",
      type: "Fixa",
      amount: 640.35,
      date: "2024-05-12",
      status: "Paga",
      recurring: true,
    },
    {
      id: 103,
      title: "Materiais descartáveis",
      category: "Material",
      type: "Variável",
      amount: 189.9,
      date: "2024-05-16",
      status: "Paga",
      recurring: false,
      notes: "Luvas, papel toalha, álcool",
    },
    {
      id: 104,
      title: "Reposição de produtos",
      category: "Produtos",
      type: "Variável",
      amount: 420,
      date: "2024-05-18",
      status: "Pendente",
      recurring: false,
    },
    {
      id: 105,
      title: "Internet",
      category: "Internet",
      type: "Fixa",
      amount: 129.9,
      date: "2024-05-20",
      status: "Pendente",
      recurring: true,
    },
  ]
}

export async function getExpenses(slug: string): Promise<Expense[]> {
  const seed = seedExpenses()
  if (typeof window === "undefined") return seed
  const stored = safeParse<Expense[]>(window.localStorage.getItem(storageKey(slug))) ?? []
  const map = new Map<number, Expense>()
  for (const e of seed) map.set(e.id, e)
  for (const e of stored) map.set(e.id, e)
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const { slug, ...data } = input
  const all = await getExpenses(slug)
  const nextId = all.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0) + 1
  const expense: Expense = { id: nextId, ...data }

  if (typeof window !== "undefined") {
    const stored = safeParse<Expense[]>(window.localStorage.getItem(storageKey(slug))) ?? []
    window.localStorage.setItem(storageKey(slug), JSON.stringify([expense, ...stored]))
  }

  return expense
}

