"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { BarChart } from "@/components/charts/bar-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/fade-in"
import { getProfessionals } from "@/services/profissionais"
import { formatReportCurrency, getSalesReport, type Period } from "@/services/relatorios"
import { cn } from "@/lib/utils"
import { TrendingUp, Wallet, Users, Sparkles } from "lucide-react"

type Metric = "valor" | "quantidade"

function formatShortDatePtBR(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00")
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d)
}

function formatMonthYearPtBR(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00")
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(d)
}

export default function RelatoriosPage() {
  const params = useParams()
  const slug = params.slug as string

  const [period, setPeriod] = React.useState<Period>("mes")
  const [metric, setMetric] = React.useState<Metric>("valor")
  const [professionalId, setProfessionalId] = React.useState<string>("all")

  const { data: professionals = [] } = useQuery({
    queryKey: ["professionals", slug],
    queryFn: () => getProfessionals(slug),
  })

  const selectedProfessionalId = professionalId === "all" ? null : Number(professionalId)

  const { data: report } = useQuery({
    queryKey: ["sales-report", slug, period, selectedProfessionalId],
    queryFn: () => getSalesReport({ slug, period, professionalId: selectedProfessionalId }),
  })

  const byProfessionalMerged = React.useMemo(() => {
    if (!report) return []
    const map = new Map<number, { count: number; amount: number }>()
    for (const p of report.byProfessional) {
      map.set(p.professionalId, { count: p.count, amount: p.amount })
    }

    return professionals
      .map((p) => {
        const v = map.get(p.id) ?? { count: 0, amount: 0 }
        return {
          id: p.id,
          name: p.name,
          role: "specialties" in (p as any) ? (p as any).specialties.join(" • ") : (p as any).role,
          avatar: p.avatar,
          count: v.count,
          amount: v.amount,
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [professionals, report])

  const best = byProfessionalMerged[0] ?? null

  const seriesData = React.useMemo(() => {
    if (!report) return []
    return report.series.map((p) => ({
      label: p.label,
      value: metric === "valor" ? p.amount : p.count,
    }))
  }, [metric, report])

  const seriesFormatter = React.useCallback(
    (value: number) => (metric === "valor" ? formatReportCurrency(value) : `${Math.round(value)}`),
    [metric]
  )

  const insight = React.useMemo(() => {
    if (!report) return null
    if (report.totalCount === 0) {
      return {
        title: "Sem vendas no período",
        description: "Quando você começar a registrar vendas, os gráficos e comparativos aparecerão aqui automaticamente.",
      }
    }
    if (best && best.amount > 0) {
      return {
        title: `Destaque: ${best.name}`,
        description: `${best.name} lidera no período com ${formatReportCurrency(best.amount)} em vendas.`,
      }
    }
    return null
  }, [best, report])

  const titlePeriod = React.useMemo(() => {
    if (!report) return ""
    if (period === "mes") return formatMonthYearPtBR(report.startDate)
    if (period === "3meses") return "Últimos 3 meses"
    return "Últimos 12 meses"
  }, [period, report])

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe quantidade e valor de vendas por período, no salão e por profissional.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="h-10 w-[140px] border-border bg-white">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="3meses">3 meses</SelectItem>
                <SelectItem value="ano">Ano</SelectItem>
              </SelectContent>
            </Select>

            <Select value={professionalId} onValueChange={setProfessionalId}>
              <SelectTrigger className="h-10 w-[220px] border-border bg-white">
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Salão inteiro</SelectItem>
                {professionals.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-border lg:col-span-2">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Período</p>
                  <p className="text-lg font-bold text-foreground mt-1">{titlePeriod}</p>
                  {report ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatShortDatePtBR(report.startDate)} – {formatShortDatePtBR(report.endDate)}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("h-9 border-border", metric === "quantidade" && "bg-secondary")}
                    onClick={() => setMetric("quantidade")}
                  >
                    Quantidade
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("h-9 border-border", metric === "valor" && "bg-secondary")}
                    onClick={() => setMetric("valor")}
                  >
                    Valor
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Kpi
                  label="Vendas"
                  value={report ? `${report.totalCount}` : "-"}
                  icon={<TrendingUp className="h-4 w-4 text-primary" />}
                  tone="primary"
                />
                <Kpi
                  label="Faturamento"
                  value={report ? formatReportCurrency(report.totalAmount) : "-"}
                  icon={<Wallet className="h-4 w-4 text-emerald-600" />}
                  tone="success"
                />
                <Kpi
                  label="Ticket médio"
                  value={report ? formatReportCurrency(report.averageTicket) : "-"}
                  icon={<Users className="h-4 w-4 text-indigo-600" />}
                  tone="info"
                />
              </div>

              <div className="pt-2">
                <BarChart data={seriesData} height={170} valueFormatter={seriesFormatter} />
              </div>

              {insight ? (
                <div className="p-4 rounded-2xl border border-primary/10 bg-primary/5 flex gap-3">
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
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Por profissional</p>
              <div className="space-y-3">
                {byProfessionalMerged.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-muted-foreground">{p.count} vendas</p>
                      <p className="text-sm font-bold text-primary">{formatReportCurrency(p.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                  Dica: compare “3 meses” vs “ano” para entender sazonalidade e ajustar metas por profissional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-border">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Ranking</p>
              <Badge variant="secondary" className="bg-secondary border-0 text-muted-foreground">
                {byProfessionalMerged.length} profissionais
              </Badge>
            </div>

            <div className="divide-y divide-border">
              {byProfessionalMerged.map((p, idx) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      #{idx + 1} {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{p.role}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="bg-secondary border-0 text-muted-foreground">
                      {p.count} vendas
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">
                      {formatReportCurrency(p.amount)}
                    </Badge>
                  </div>
                </div>
              ))}
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
  tone: "primary" | "success" | "info"
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/5 border-primary/10"
      : tone === "success"
      ? "bg-emerald-500/5 border-emerald-500/10"
      : "bg-indigo-500/5 border-indigo-500/10"

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
