"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FadeIn } from "@/components/fade-in"
import { getExpenses } from "@/services/despesas"
import { cn } from "@/lib/utils"
import { Plus, Search, ArrowUpRight, ArrowDownRight, Sparkles, Wallet, CalendarDays } from "lucide-react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function monthKey(dateISO: string) {
  return dateISO.slice(0, 7)
}

function sameMonth(dateISO: string, monthISO: string) {
  return monthKey(dateISO) === monthISO
}

export default function DespesasPage() {
  const params = useParams()
  const slug = params.slug as string

  const [search, setSearch] = React.useState("")
  const [month, setMonth] = React.useState(() => new Date().toISOString().slice(0, 7))

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", slug],
    queryFn: () => getExpenses(slug),
  })

  const monthExpenses = expenses.filter((e) => sameMonth(e.date, month))
  const filtered = monthExpenses.filter((e) => {
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return `${e.title} ${e.category} ${e.type} ${e.status}`.toLowerCase().includes(q)
  })

  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const fixedTotal = monthExpenses.filter((e) => e.type === "Fixa").reduce((sum, e) => sum + e.amount, 0)
  const variableTotal = monthExpenses.filter((e) => e.type === "Variável").reduce((sum, e) => sum + e.amount, 0)
  const pendingTotal = monthExpenses.filter((e) => e.status === "Pendente").reduce((sum, e) => sum + e.amount, 0)

  const topCategory = (() => {
    const map = new Map<string, number>()
    for (const e of monthExpenses) map.set(e.category, (map.get(e.category) || 0) + e.amount)
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
    return sorted[0] ? { category: sorted[0][0], amount: sorted[0][1] } : null
  })()

  const insight = (() => {
    if (monthExpenses.length === 0) return null
    const ratio = total > 0 ? variableTotal / total : 0
    if (pendingTotal > 0) {
      return {
        title: "Você tem despesas pendentes",
        description: `Há ${formatCurrency(pendingTotal)} em despesas pendentes neste mês. Marque como paga para manter o controle em dia.`,
      }
    }
    if (ratio > 0.6) {
      return {
        title: "Despesas variáveis altas",
        description:
          "Suas despesas variáveis estão pesando neste mês. Tente negociar reposições e agrupar compras para reduzir frete e custos.",
      }
    }
    if (topCategory) {
      return {
        title: `Maior categoria: ${topCategory.category}`,
        description: `Essa categoria representa ${formatCurrency(topCategory.amount)} no mês. Vale revisar contratos e recorrências para otimizar.`,
      }
    }
    return null
  })()

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Despesas</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe custos fixos e variáveis para manter o salão saudável.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white gap-2 h-10 rounded-xl shadow-lg shadow-primary/20">
            <Link href={`/${slug}/despesas/nova`}>
              <Plus className="h-4 w-4" />
              Nova despesa
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-border lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Kpi
                  label="Total do mês"
                  value={formatCurrency(total)}
                  icon={<Wallet className="h-4 w-4 text-primary" />}
                  tone="primary"
                />
                <Kpi
                  label="Fixas"
                  value={formatCurrency(fixedTotal)}
                  icon={<ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                  tone="success"
                />
                <Kpi
                  label="Variáveis"
                  value={formatCurrency(variableTotal)}
                  icon={<ArrowDownRight className="h-4 w-4 text-indigo-600" />}
                  tone="info"
                />
                <Kpi
                  label="Pendentes"
                  value={formatCurrency(pendingTotal)}
                  icon={<CalendarDays className="h-4 w-4 text-amber-600" />}
                  tone="warning"
                />
              </div>

              {insight ? (
                <div className="mt-6 p-4 rounded-2xl border border-primary/10 bg-primary/5 flex gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <CardContent className="p-6 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filtros</p>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mês</label>
                <Input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Título, categoria..."
                    className="h-11 pl-9 border-border bg-secondary/20 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-secondary/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dica</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Cadastre despesas fixas como recorrentes (aluguel, luz, internet). Assim fica mais fácil prever custo mensal e ajustar preços.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-border">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Lançamentos</p>
              <Badge variant="secondary" className="bg-secondary border-0 text-muted-foreground">
                {filtered.length} itens
              </Badge>
            </div>

            <div className="divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-sm font-bold text-foreground">Nada por aqui</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sem despesas para este mês com os filtros atuais.
                  </p>
                  <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-white">
                    <Link href={`/${slug}/despesas/nova`}>Cadastrar despesa</Link>
                  </Button>
                </div>
              ) : (
                filtered.map((e) => (
                  <div key={e.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{e.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className="bg-secondary border-0 text-muted-foreground">
                          {e.category}
                        </Badge>
                        <Badge
                          className={cn(
                            "border font-medium",
                            e.type === "Fixa"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                          )}
                        >
                          {e.type}
                        </Badge>
                        <Badge
                          className={cn(
                            "border font-medium",
                            e.status === "Paga"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          )}
                        >
                          {e.status}
                        </Badge>
                        {e.recurring ? (
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            Recorrente
                          </Badge>
                        ) : null}
                        <span className="text-xs text-muted-foreground">{e.date}</span>
                      </div>
                      {e.notes ? <p className="text-xs text-muted-foreground mt-2 truncate">{e.notes}</p> : null}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{formatCurrency(e.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}

function Kpi({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tone: "primary" | "success" | "info" | "warning"
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/5 border-primary/10"
      : tone === "success"
      ? "bg-emerald-500/5 border-emerald-500/10"
      : tone === "info"
      ? "bg-indigo-500/5 border-indigo-500/10"
      : "bg-amber-500/5 border-amber-500/10"

  return (
    <div className={cn("p-4 rounded-2xl border", toneClass)}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
        <div className="p-1.5 rounded-lg bg-white border border-border">{icon}</div>
      </div>
      <p className="text-lg font-bold text-foreground mt-2">{value}</p>
    </div>
  )
}
