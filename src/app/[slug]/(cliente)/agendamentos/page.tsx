"use client"

import * as React from "react"
import { appointments, professionals } from "@/lib/mocks"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, MoreVertical, Plus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FadeIn } from "@/components/fade-in"

export default function AgendamentosClientePage() {
  const params = useParams()
  const slug = params.slug as string

  return (
    <FadeIn>
      <div className="min-h-screen bg-[#F7F7F8] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Meus agendamentos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus horários e agende novos serviços.</p>
          </div>
          <Link href={`/${slug}/novo-agendamento`}>
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
            {appointments.slice(2, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-border/60 opacity-70 hover:opacity-100 transition-opacity cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-muted-foreground w-12">15 Mai</div>
                  <div className="w-1 h-8 rounded-full bg-secondary"></div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{app.service}</p>
                    <p className="text-xs text-muted-foreground">{professionals.find(p => p.id === app.professionalId)?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">R$ 70,00</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </FadeIn>
  )
}
