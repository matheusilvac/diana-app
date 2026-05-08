"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Scissors, Clock, Tag, BadgeCheck } from "lucide-react"

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
import { createService } from "@/services/servicos"

const categories = ["Cabelo", "Barbearia", "Manicure e Pedicure", "Estética"] as const

const schema = z.object({
  name: z.string().min(2, "Informe o nome do serviço"),
  category: z.enum(categories, { message: "Selecione um tipo" }),
  durationMinutes: z
    .number()
    .finite("Informe um tempo válido")
    .int()
    .min(5, "Tempo mínimo: 5 min")
    .max(480, "Tempo máximo: 480 min"),
  price: z.number().finite("Informe um valor válido").min(0.01, "Informe um valor maior que zero"),
})

type FormValues = z.infer<typeof schema>

export default function NovoServicoPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "Cabelo",
      durationMinutes: 45,
      price: 70,
    },
    mode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return createService({
        slug,
        name: values.name,
        category: values.category,
        durationMinutes: values.durationMinutes,
        price: values.price,
      })
    },
    onSuccess: async (service) => {
      await queryClient.invalidateQueries({ queryKey: ["services", slug] })
      toast.success("Serviço criado com sucesso", { description: service.name })
      router.push(`/${slug}/servicos`)
    },
    onError: () => {
      toast.error("Não foi possível criar o serviço")
    },
  })

  const values = form.watch()
  const isSubmitting = mutation.isPending

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link href={`/${slug}/servicos`} aria-label="Voltar para serviços">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Novo serviço</h1>
                <p className="text-sm text-muted-foreground">
                  Crie um serviço para aparecer no catálogo e no agendamento online.
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
                    <label className="text-sm font-semibold text-foreground">Nome do serviço</label>
                    <Input
                      placeholder="Ex: Corte Feminino"
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Tipo</label>
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
                    <label className="text-sm font-semibold text-foreground">Tempo (min)</label>
                    <Input
                      inputMode="numeric"
                      type="number"
                      min={5}
                      max={480}
                      step={5}
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("durationMinutes", { valueAsNumber: true })}
                    />
                    {form.formState.errors.durationMinutes?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.durationMinutes.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Valor (R$)</label>
                    <Input
                      inputMode="decimal"
                      type="number"
                      min={0.01}
                      step={0.01}
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("price", { valueAsNumber: true })}
                    />
                    {form.formState.errors.price?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button asChild variant="outline" className="h-10 border-border">
                    <Link href={`/${slug}/servicos`}>Cancelar</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="h-10 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {isSubmitting ? "Salvando..." : "Salvar serviço"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white border-border h-fit lg:sticky lg:top-8">
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pré-visualização</p>
                <h2 className="text-lg font-bold text-foreground mt-1">{values.name || "Nome do serviço"}</h2>
                <p className="text-xs text-muted-foreground">{values.category || "Tipo"}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Tempo</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {Number.isFinite(values.durationMinutes) ? `${values.durationMinutes} min` : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/10">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">Valor</span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {Number.isFinite(values.price)
                      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(values.price)
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-primary/5">
                  <div className="flex items-center gap-2 text-primary">
                    <Scissors className="h-4 w-4" />
                    <span className="text-sm font-semibold">Status</span>
                  </div>
                  <span className="text-sm font-bold text-primary">Ativo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}
