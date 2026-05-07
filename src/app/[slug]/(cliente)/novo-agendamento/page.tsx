"use client"

import * as React from "react"
import { services, professionals } from "@/lib/mocks"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  CheckCircle2,
  Info,
  ShieldCheck,
  Scissors,
  Palmtree,
  Sparkles,
  Eye,
  Brush,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FadeIn } from "@/components/fade-in"

const categories = [
  { id: "todos", name: "Todos os serviços", icon: CalendarIcon },
  { id: "cabelo", name: "Cabelo", icon: Scissors },
  { id: "manicure", name: "Manicure e Pedicure", icon: Palmtree },
  { id: "estetica", name: "Estética", icon: Sparkles },
  { id: "sobrancelhas", name: "Sobrancelhas", icon: Eye },
  { id: "maquiagem", name: "Maquiagem", icon: Brush },
  { id: "depilacao", name: "Depilação", icon: Zap },
]

export default function NovoAgendamentoPage() {
  const [step, setStep] = React.useState(1)
  const [selectedService, setSelectedService] = React.useState<any>(null)
  const [selectedProfessional, setSelectedProfessional] = React.useState<any>(null)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)

  return (
    <FadeIn>
      <div className="min-h-screen bg-[#F7F7F8] p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* Left Column - Selection Flow */}
        <div className="flex-1 space-y-4">
          {/* Step 1: Service Selection */}
          <CollapsibleStep 
            number={1} 
            title="Escolha o serviço" 
            description="Selecione o serviço que deseja agendar"
            isOpen={step === 1}
            isCompleted={step > 1}
            onEdit={() => setStep(1)}
          >
            <div className="flex gap-6">
              {/* Categories Sidebar */}
              <div className="w-56 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      cat.id === "todos" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-white hover:text-foreground"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div className="flex-1 space-y-1">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service)
                      setStep(2)
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-transparent hover:border-primary/20 hover:shadow-sm transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.duration}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-foreground">{service.price}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleStep>

          {/* Step 2: Professional Selection */}
          <CollapsibleStep 
            number={2} 
            title="Escolha o profissional" 
            description="Selecione o profissional de sua preferência"
            isOpen={step === 2}
            isCompleted={step > 2}
            onEdit={() => setStep(2)}
          >
            <div className="grid grid-cols-2 gap-4">
              {professionals.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    setSelectedProfessional(prof)
                    setStep(3)
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-transparent hover:border-primary/20 hover:shadow-sm transition-all text-left group"
                >
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src={prof.avatar} />
                    <AvatarFallback>{prof.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{prof.name}</p>
                    <p className="text-xs text-muted-foreground">{prof.role}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </CollapsibleStep>

          {/* Step 3: Date & Time Selection */}
          <CollapsibleStep 
            number={3} 
            title="Escolha a data e horário" 
            description="Veja os horários disponíveis e escolha o melhor para você"
            isOpen={step === 3}
            isCompleted={step > 3}
            onEdit={() => setStep(3)}
          >
            <div className="space-y-6">
              {/* Simple Date Strip */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(`2${i}/05`)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[70px] h-20 rounded-xl border transition-all",
                      selectedDate === `2${i}/05`
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                        : "bg-white border-border text-foreground hover:border-primary/30"
                    )}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Mai</span>
                    <span className="text-lg font-bold">2{i}</span>
                    <span className="text-[10px] font-medium opacity-60">SEG</span>
                  </button>
                ))}
              </div>

              {/* Time Grid */}
              <div className="grid grid-cols-4 gap-2">
                {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "py-3 rounded-lg border text-sm font-bold transition-all",
                      selectedTime === time
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-border text-foreground hover:border-primary/30"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleStep>
        </div>

        {/* Right Column - Summary */}
        <div className="w-[380px]">
          <Card className="sticky top-8 bg-white border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/10">
              <h2 className="text-lg font-bold text-foreground">Resumo do agendamento</h2>
            </div>
            
            <CardContent className="p-6 space-y-6">
              {!selectedService ? (
                <div className="py-8 px-4 bg-primary/5 rounded-2xl border border-dashed border-primary/20 flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Selecione um serviço para ver o resumo do agendamento
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <SummaryItem icon={Scissors} label="Serviço" value={selectedService.name} />
                  <SummaryItem icon={User} label="Profissional" value={selectedProfessional?.name || "-"} />
                  <SummaryItem icon={CalendarIcon} label="Data e horário" value={selectedDate && selectedTime ? `${selectedDate} às ${selectedTime}` : "-"} />
                  <SummaryItem icon={Clock} label="Duração" value={selectedService.duration} />
                  <SummaryItem icon={Zap} label="Valor" value={selectedService.price} isHighlight />
                </div>
              )}

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <Info className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Você poderá revisar todos os detalhes antes de confirmar seu agendamento.
                </p>
              </div>

              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                disabled={!selectedTime}
              >
                Confirmar agendamento
              </Button>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Seus dados estão protegidos</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </FadeIn>
  )
}

function CollapsibleStep({ 
  number, 
  title, 
  description, 
  isOpen, 
  isCompleted, 
  onEdit, 
  children 
}: { 
  number: number, 
  title: string, 
  description: string, 
  isOpen: boolean, 
  isCompleted: boolean, 
  onEdit: () => void,
  children: React.ReactNode 
}) {
  return (
    <Card className={cn(
      "bg-white border-border transition-all overflow-hidden",
      !isOpen && !isCompleted && "opacity-60"
    )}>
      <div className={cn(
        "p-6 flex items-center justify-between transition-colors",
        isOpen && "bg-primary/5"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
            isCompleted ? "bg-emerald-500 text-white" : isOpen ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
          )}>
            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : number}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{title}</h3>
            {!isOpen && isCompleted && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        {!isOpen && isCompleted && (
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-primary font-bold hover:bg-primary/10">
            Alterar
          </Button>
        )}
      </div>
      {isOpen && (
        <CardContent className="p-6 pt-2">
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
          {children}
        </CardContent>
      )}
    </Card>
  )
}

function SummaryItem({ icon: Icon, label, value, isHighlight = false }: { icon: any, label: string, value: string, isHighlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-secondary/50 rounded-lg">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-bold",
        isHighlight ? "text-primary text-base" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  )
}
