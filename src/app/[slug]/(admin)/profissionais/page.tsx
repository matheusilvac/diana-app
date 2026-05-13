"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MoreHorizontal, Calendar, Star, Pencil, Trash2 } from "lucide-react"
import { FadeIn } from "@/components/fade-in"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProfessional, getProfessionals } from "@/services/profissionais"
import { toast } from "sonner"

export default function ProfissionaisPage() {
  const params = useParams()
  const slug = params.slug as string
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = React.useState<number | null>(null)

  const { data: professionals = [] } = useQuery({
    queryKey: ["professionals", slug],
    queryFn: () => getProfessionals(slug),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteProfessional(slug, id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professionals", slug] })
      toast.success("Profissional excluído")
      setDeleteId(null)
    },
    onError: () => {
      toast.error("Não foi possível excluir o profissional")
    },
  })

  return (
    <>
      <FadeIn>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profissionais</h1>
            <p className="text-sm text-muted-foreground">Gerencie a equipe do seu salão.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Link href={`/${slug}/profissionais/novo`}>
              <Plus className="h-4 w-4" />
              Novo profissional
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {professionals.map((prof) => (
            <Card key={prof.id} className="bg-white border-border group overflow-hidden">
              <CardHeader className="p-0">
                <div className="h-24 bg-secondary/50 relative">
                  <div 
                    className="absolute bottom-0 left-6 translate-y-1/2 p-1 bg-white rounded-full border border-border"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={prof.avatar} />
                      <AvatarFallback>{prof.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/50 hover:bg-white transition-colors"
                        aria-label="Ações do profissional"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/${slug}/profissionais/${prof.id}/editar`} className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => {
                          e.preventDefault()
                          setDeleteId(prof.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-12 pb-6 px-6">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-lg font-bold">{prof.name}</CardTitle>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
                    {"status" in prof ? (prof.status as any) : "Ativo"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {"specialties" in prof ? (prof.specialties as any[]).join(" • ") : (prof as any).role}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Atendimentos</p>
                    <p className="text-sm font-bold text-foreground">
                      {"attendancesCount" in prof ? (prof.attendancesCount as any) : 124}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Avaliação</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-foreground">
                        {"rating" in prof ? (prof.rating as any) : 4.9}
                      </p>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Horários</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-[10px] font-medium border-border">
                      {"schedule" in prof ? `${(prof.schedule as any).start} - ${(prof.schedule as any).end}` : "08:00 - 18:00"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-medium border-border">
                      {"schedule" in prof ? (prof.schedule as any).days.join(" • ") : "Seg - Sex"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t border-border bg-secondary/10">
                <Button variant="outline" className="w-full gap-2 text-xs font-semibold border-border hover:bg-white transition-colors">
                  <Calendar className="h-3.5 w-3.5" />
                  Ver agenda completa
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      </FadeIn>
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
        title="Excluir profissional?"
        description="Essa ação remove o profissional da lista. Você poderá recriar depois."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteId === null) return
          deleteMutation.mutate(deleteId)
        }}
      />
    </>
  )
}
