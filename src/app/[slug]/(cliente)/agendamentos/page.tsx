"use client"

import * as React from "react"
import { appointments, professionals, services } from "@/lib/mocks"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  MoreVertical,
  Plus,
  ChevronRight,
  Scissors,
  User,
  BadgeCheck,
} from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/fade-in"

const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function formatShortDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = monthLabels[date.getMonth()] ?? ""
  return `${day} ${month}`
}

export default function AgendamentosClientePage() {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false)
  const [selectedHistory, setSelectedHistory] = React.useState<{
    appointment: (typeof appointments)[number]
    date: Date
    professionalName: string
    professionalAvatar: string | undefined
    price: string
  } | null>(null)

  const historyAppointments = React.useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return appointments.slice(2, 5).map((appointment, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (index + 1) * 7)

      const professional = professionals.find((p) => p.id === appointment.professionalId)
      const service = services.find((s) => s.name === appointment.service)

      return {
        appointment,
        date,
        professionalName: professional?.name ?? "-",
        professionalAvatar: professional?.avatar,
        price: service?.price ?? "R$ 70,00",
      }
    })
  }, [])

  const openHistoryDetails = (item: (typeof historyAppointments)[number]) => {
    setSelectedHistory(item)
    setIsHistoryOpen(true)
  }

  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Meus agendamentos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus horários e agende novos serviços.</p>
          </div>
          <Link href="/novo-agendamento">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 font-bold shadow-lg shadow-primary/20 gap-2">
              <Plus className="h-5 w-5" />
              Novo agendamento
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Próximos
            <Badge className="bg-primary text-white border-none h-5 px-1.5 min-w-5 flex items-center justify-center">2</Badge>
          </h2>
          
          <div className="grid gap-4">
            {[appointments[0], appointments[4]].map((app, i) => {
              const prof = professionals.find(p => p.id === app.professionalId)
              return (
                <Card key={app.id} className="bg-white border-border hover:shadow-md transition-all group overflow-hidden">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex flex-col items-center justify-center border border-primary/10">
                          <span className="text-[10px] font-bold text-primary uppercase">Mai</span>
                          <span className="text-xl font-black text-primary leading-none">2{i}</span>
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">{app.service}</p>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            {app.time} • {app.duration}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 md:border-l md:pl-6 border-border">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={prof?.avatar} />
                          <AvatarFallback>{prof?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Profissional</p>
                          <p className="font-bold text-foreground">{prof?.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/20 p-6 flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 md:border-l border-border">
                      <div className="flex gap-2">
                        <Button variant="ghost" className="text-sm font-bold text-muted-foreground hover:text-foreground">Cancelar</Button>
                        <Button variant="outline" className="text-sm font-bold border-border bg-white hover:bg-secondary">Reagendar</Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h2 className="text-lg font-bold text-muted-foreground">Histórico</h2>
          <div className="space-y-3">
            {historyAppointments.map((item) => (
              <div
                key={item.appointment.id}
                onClick={() => openHistoryDetails(item)}
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-border/60 opacity-70 hover:opacity-100 transition-opacity cursor-pointer group"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-muted-foreground w-12">{formatShortDate(item.date)}</div>
                  <div className="w-1 h-8 rounded-full bg-secondary"></div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.appointment.service}</p>
                    <p className="text-xs text-muted-foreground">{item.professionalName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">{item.price}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    <Dialog
      open={isHistoryOpen}
      onOpenChange={(open) => {
        setIsHistoryOpen(open)
        if (!open) setSelectedHistory(null)
      }}
    >
      <DialogContent className="bg-white border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Resumo do agendamento</DialogTitle>
          <DialogDescription>Detalhes completos do seu agendamento.</DialogDescription>
        </DialogHeader>

        {selectedHistory && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-secondary/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-primary" />
                    <p className="font-bold text-foreground">{selectedHistory.appointment.service}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatShortDate(selectedHistory.date)} às {selectedHistory.appointment.time}
                    </span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{selectedHistory.appointment.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Valor</p>
                  <p className="text-lg font-black text-primary">{selectedHistory.price}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={selectedHistory.professionalAvatar} />
                  <AvatarFallback>{selectedHistory.professionalName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Profissional</p>
                  <p className="font-bold text-foreground">{selectedHistory.professionalName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Concluído</span>
              </div>
            </div>

            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
              Agendar novamente
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </FadeIn>
  )
}
