"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, BadgeCheck, CalendarDays, DollarSign, Repeat, Tag, Text } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/fade-in"
import { createExpense } from "@/services/despesas"

const categories = [
  "Aluguel",
  "Energia",
  "Água",
  "Internet",
  "Material",
  "Produtos",
  "Marketing",
  "Impostos",
  "Folha de pagamento",
  "Outros",
] as const

const schema = z.object({
  title: z.string().min(2, "Informe um título"),
  category: z.enum(categories, { message: "Selecione uma categoria" }),
  type: z.enum(["Fixa", "Variável"] as const),
  amount: z.number().finite("Informe um valor válido").min(0.01, "Informe um valor maior que zero"),
  date: z.string().min(8, "Selecione uma data"),
  status: z.enum(["Paga", "Pendente"] as const),
  recurring: z.enum(["sim", "nao"]),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export default function NovaDespesaPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "Aluguel",
      type: "Fixa",
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      status: "Pendente",
      recurring: "nao",
      notes: "",
    },
    mode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return createExpense({
        slug,
        title: values.title,
        category: values.category,
        type: values.type,
        amount: values.amount,
        date: values.date,
        status: values.status,
        recurring: values.recurring === "sim",
        notes: values.notes || undefined,
      })
    },
    onSuccess: async (expense) => {
      await queryClient.invalidateQueries({ queryKey: ["expenses", slug] })
      toast.success("Despesa criada com sucesso", { description: expense.title })
      router.push(`/${slug}/despesas`)
    },
    onError: () => {
      toast.error("Não foi possível criar a despesa")
    },
  })

  const values = form.watch()
  const isSubmitting = mutation.isPending
  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link href={`/${slug}/despesas`} aria-label="Voltar para despesas">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nova despesa</h1>
                <p className="text-sm text-muted-foreground">
                  Registre custos fixos e variáveis para acompanhar a saúde do salão.
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !form.formState.isValid}
            className="bg-primary hover:bg-primary/90 text-white gap-2 h-10 rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none"
          >
            <BadgeCheck className="h-4 w-4" />
            Salvar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <Card className="bg-white border-border">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Título</label>
                    <Input
                      placeholder="Ex: Aluguel do salão"
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("title")}
                    />
                    {form.formState.errors.title?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Categoria</label>
                    <Controller
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 border-border bg-secondary/20">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.category?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Tipo</label>
                    <Controller
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 border-border bg-secondary/20">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fixa">Fixa</SelectItem>
                            <SelectItem value="Variável">Variável</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Status</label>
                    <Controller
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 border-border bg-secondary/20">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Paga">Paga</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Valor (R$)</label>
                    <Input
                      inputMode="decimal"
                      type="number"
                      min={0.01}
                      step={0.01}
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("amount", { valueAsNumber: true })}
                    />
                    {form.formState.errors.amount?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Data</label>
                    <Input
                      type="date"
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("date")}
                    />
                    {form.formState.errors.date?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Recorrente</label>
                  <Controller
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 border-border bg-secondary/20">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nao">Não</SelectItem>
                          <SelectItem value="sim">Sim</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Observação (opcional)</label>
                  <Input
                    placeholder="Ex: vencimento todo dia 05"
                    className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                    {...form.register("notes")}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button asChild variant="outline" className="h-10 border-border">
                    <Link href={`/${slug}/despesas`}>Cancelar</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="h-10 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {isSubmitting ? "Salvando..." : "Salvar despesa"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white border-border h-fit lg:sticky lg:top-8">
            <CardContent className="p-6 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumo</p>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">Categoria</span>
                </div>
                <span className="text-sm font-bold text-foreground">{values.category}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Text className="h-4 w-4" />
                  <span className="text-sm font-medium">Título</span>
                </div>
                <span className="text-sm font-bold text-foreground truncate max-w-[160px]">
                  {values.title || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Valor</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {Number.isFinite(values.amount) && values.amount > 0 ? formatCurrency(values.amount) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm font-medium">Data</span>
                </div>
                <span className="text-sm font-bold text-foreground">{values.date}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-primary/5">
                <div className="flex items-center gap-2 text-primary">
                  <Repeat className="h-4 w-4" />
                  <span className="text-sm font-semibold">Recorrente</span>
                </div>
                <span className="text-sm font-bold text-primary">{values.recurring === "sim" ? "Sim" : "Não"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}
