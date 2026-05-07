"use client"

import * as React from "react"
import { professionals, appointments } from "@/lib/mocks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Phone, ChevronRight, ChevronLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/fade-in"

const hours = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
]

export default function AgendaPage() {
  return (
    <FadeIn>
      <div className="flex gap-8">
        <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">Visualize e gerencie os agendamentos do salão.</p>
        </div>

        <Card className="bg-white border-border overflow-hidden">
          <div className="grid grid-cols-[80px_repeat(4,1fr)] border-b border-border">
            <div className="p-4 bg-secondary/30"></div>
            {professionals.map((prof) => (
              <div key={prof.id} className="p-4 flex flex-col items-center gap-1 border-l border-border bg-white">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={prof.avatar} />
                  <AvatarFallback>{prof.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{prof.name}</p>
                  <p className="text-[10px] text-muted-foreground">{prof.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[80px_repeat(4,1fr)] h-20 border-b border-border/50">
                <div className="flex justify-center pt-2 text-xs font-medium text-muted-foreground bg-secondary/10">
                  {hour}
                </div>
                {professionals.map((prof) => (
                  <div key={`${hour}-${prof.id}`} className="border-l border-border/50 relative">
                    {appointments
                      .filter(app => app.professionalId === prof.id && app.time.startsWith(hour.split(':')[0]))
                      .map(app => (
                        <AppointmentCard key={app.id} appointment={app} professionalColor={prof.color} />
                      ))
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8D5AE2]"></div>
            Cabeleireira
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
            Barbeiro
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
            Manicure
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
            Esteticista
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Agendamento confirmado
          </div>
        </div>
      </div>

      <div className="w-80 space-y-6">
        <Card className="p-4 bg-white border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Maio 2024</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronLeft className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-3 w-3" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-[10px] text-center text-muted-foreground mb-2">
            <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 text-[11px] text-center gap-y-2">
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={cn(
                "h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-colors",
                i + 1 === 20 ? "bg-primary text-white font-bold" : "hover:bg-secondary"
              )}>
                {i + 1}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-white border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Próximos agendamentos</h2>
            <Button variant="link" className="text-primary text-xs h-auto p-0">Ver todos</Button>
          </div>
          <div className="space-y-4">
            {appointments.slice(0, 5).map(app => (
              <div key={app.id} className="flex gap-3">
                <div className="text-xs font-bold text-foreground w-10 pt-1">{app.time}</div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-foreground">{app.service}</p>
                  <p className="text-[10px] text-muted-foreground">{app.client}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: professionals.find(p => p.id === app.professionalId)?.color }}></div>
                    <p className="text-[10px] text-muted-foreground">{professionals.find(p => p.id === app.professionalId)?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 text-xs h-9 border-border hover:bg-secondary">
            Ver todos os agendamentos
          </Button>
        </Card>
      </div>
    </div>
    </FadeIn>
  )
}

function AppointmentCard({ appointment, professionalColor }: { appointment: any, professionalColor: string }) {
  return (
    <div 
      className="absolute inset-x-1 top-1 p-2 rounded-lg border border-transparent hover:border-border transition-all cursor-pointer shadow-sm group"
      style={{ 
        backgroundColor: `${professionalColor}15`, 
        borderColor: `${professionalColor}30`,
        height: "calc(100% - 8px)"
      }}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] font-bold" style={{ color: professionalColor }}>{appointment.time}</span>
        <Phone className="size-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-[10px] font-bold text-foreground leading-tight truncate">{appointment.service}</p>
      <p className="text-[9px] text-muted-foreground truncate">{appointment.client}</p>
    </div>
  )
}
