"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, BadgeCheck, Camera, CalendarDays, Clock, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FadeIn } from "@/components/fade-in"
import { createProfessional } from "@/services/profissionais"
import { cn } from "@/lib/utils"

const specialties = ["Barbeiro", "Cabeleireiro", "Manicure", "Esteticista"] as const
const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const

const schema = z
  .object({
    name: z.string().min(2, "Informe o nome do profissional"),
    avatar: z.string().optional(),
    specialties: z.array(z.enum(specialties)).min(1, "Selecione pelo menos 1 tipo"),
    days: z.array(z.enum(weekDays)).min(1, "Selecione pelo menos 1 dia"),
    start: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Informe um horário válido (HH:MM)"),
    end: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Informe um horário válido (HH:MM)"),
  })
  .superRefine((val, ctx) => {
    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + m
    }
    if (toMin(val.end) <= toMin(val.start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message: "O horário final precisa ser maior que o inicial",
      })
    }
  })

type FormValues = z.infer<typeof schema>

export default function NovoProfissionalPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      avatar: "",
      specialties: ["Barbeiro"],
      days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      start: "08:00",
      end: "18:00",
    },
    mode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return createProfessional({
        slug,
        name: values.name,
        avatar: values.avatar || undefined,
        specialties: values.specialties,
        schedule: {
          days: values.days,
          start: values.start,
          end: values.end,
        },
      })
    },
    onSuccess: async (prof) => {
      await queryClient.invalidateQueries({ queryKey: ["professionals", slug] })
      toast.success("Profissional criado com sucesso", { description: prof.name })
      router.push(`/${slug}/profissionais`)
    },
    onError: () => {
      toast.error("Não foi possível criar o profissional")
    },
  })

  const isSubmitting = mutation.isPending
  const values = form.watch()

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  const toggleArrayValue = <T extends string>(field: "specialties" | "days", value: T) => {
    const current = form.getValues(field as any) as T[]
    const exists = current.includes(value)
    const next = exists ? current.filter((v) => v !== value) : [...current, value]
    form.setValue(field as any, next, { shouldDirty: true, shouldValidate: true })
  }

  const onPickAvatar = async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      form.setValue("avatar", result, { shouldDirty: true, shouldValidate: true })
    }
    reader.readAsDataURL(file)
  }

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link href={`/${slug}/profissionais`} aria-label="Voltar para profissionais">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Novo profissional</h1>
                <p className="text-sm text-muted-foreground">
                  Adicione um membro da equipe com tipos de atendimento e horários.
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
                    <label className="text-sm font-semibold text-foreground">Nome</label>
                    <Input
                      placeholder="Ex: Carlos"
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Foto</label>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 border border-border bg-secondary/20">
                        <AvatarImage src={values.avatar || ""} />
                        <AvatarFallback className="text-xs font-bold">
                          {values.name?.trim()?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>

                      <label className="flex-1">
                        <div className="h-11 px-4 rounded-xl border border-border bg-secondary/20 hover:bg-white transition-colors flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-muted-foreground truncate">
                            {values.avatar ? "Foto selecionada" : "Selecionar imagem"}
                          </span>
                          <Camera className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) void onPickAvatar(file)
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Tipos</label>
                    <Badge variant="secondary" className="bg-secondary border-0 text-muted-foreground">
                      Pode selecionar mais de 1
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {specialties.map((s) => {
                      const selected = values.specialties?.includes(s)
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleArrayValue("specialties", s)}
                          className={cn(
                            "h-11 rounded-xl border text-sm font-semibold transition-all",
                            selected
                              ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                              : "bg-white border-border text-foreground hover:border-primary/30"
                          )}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>

                  {form.formState.errors.specialties?.message && (
                    <p className="text-xs text-destructive">{form.formState.errors.specialties.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Horário inicial</label>
                    <Input
                      type="time"
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("start")}
                    />
                    {form.formState.errors.start?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.start.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Horário final</label>
                    <Input
                      type="time"
                      className="h-11 border-border bg-secondary/20 focus:bg-white transition-colors"
                      {...form.register("end")}
                    />
                    {form.formState.errors.end?.message && (
                      <p className="text-xs text-destructive">{form.formState.errors.end.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Dias</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {weekDays.map((d) => {
                      const selected = values.days?.includes(d)
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleArrayValue("days", d)}
                          className={cn(
                            "h-10 rounded-xl border text-xs font-bold transition-all",
                            selected
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          )}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>
                  {form.formState.errors.days?.message && (
                    <p className="text-xs text-destructive">{form.formState.errors.days.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button asChild variant="outline" className="h-10 border-border">
                    <Link href={`/${slug}/profissionais`}>Cancelar</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="h-10 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {isSubmitting ? "Salvando..." : "Salvar profissional"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white border-border h-fit lg:sticky lg:top-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={values.avatar || ""} />
                  <AvatarFallback className="text-xs font-bold">
                    {values.name?.trim()?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pré-visualização</p>
                  <h2 className="text-lg font-bold text-foreground">{values.name || "Nome do profissional"}</h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-border bg-secondary/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Tipos</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {values.specialties?.length ? values.specialties.join(", ") : "-"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-secondary/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Horário</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {values.start} - {values.end}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-primary/5">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm font-semibold">Dias</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(values.days || []).map((d) => (
                      <Badge key={d} variant="secondary" className="bg-white border border-border text-foreground">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}

