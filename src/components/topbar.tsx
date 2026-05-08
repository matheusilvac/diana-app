"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Bell, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ViewMode = "dia" | "semana" | "mes"

function toISODate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function fromISODate(value: string | null) {
  if (!value) return null
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  const dt = new Date(y, mo, d)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}

function formatLongPtBR(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function Topbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialDate = React.useMemo(() => {
    return fromISODate(searchParams.get("date")) ?? new Date()
  }, [searchParams])

  const initialView = React.useMemo<ViewMode>(() => {
    const v = searchParams.get("view")
    return v === "dia" || v === "semana" || v === "mes" ? v : "dia"
  }, [searchParams])

  const [date, setDate] = React.useState<Date>(initialDate)
  const [view, setView] = React.useState<ViewMode>(initialView)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const nextDate = fromISODate(searchParams.get("date")) ?? new Date()
    setDate(nextDate)
    const v = searchParams.get("view")
    setView(v === "dia" || v === "semana" || v === "mes" ? v : "dia")
  }, [searchParams])

  const updateUrl = React.useCallback(
    (next: { date?: Date; view?: ViewMode }) => {
      const sp = new URLSearchParams(searchParams.toString())
      if (next.date) sp.set("date", toISODate(next.date))
      if (next.view) sp.set("view", next.view)
      const qs = sp.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router, searchParams]
  )

  const goToday = () => {
    const today = new Date()
    setDate(today)
    updateUrl({ date: today })
  }

  const goPrev = () => {
    const next =
      view === "mes" ? addMonths(date, -1) : view === "semana" ? addDays(date, -7) : addDays(date, -1)
    setDate(next)
    updateUrl({ date: next })
  }

  const goNext = () => {
    const next =
      view === "mes" ? addMonths(date, 1) : view === "semana" ? addDays(date, 7) : addDays(date, 1)
    setDate(next)
    updateUrl({ date: next })
  }

  return (
    <header className="h-16 border-b border-border bg-white sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-medium" onClick={goToday}>
            Hoje
          </Button>
          <div className="flex items-center border border-input rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-r border-input"
              onClick={goPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={goNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer hover:bg-secondary p-1.5 rounded-md transition-colors"
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">{formatLongPtBR(date)}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (!d) return
                setDate(d)
                updateUrl({ date: d })
                setOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select
          value={view}
          onValueChange={(v) => {
            const next = v as ViewMode
            setView(next)
            updateUrl({ view: next })
          }}
        >
          <SelectTrigger className="w-[80px] h-8 text-xs font-medium border-none shadow-none bg-secondary hover:bg-secondary/80">
            <SelectValue placeholder="Visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia">Dia</SelectItem>
            <SelectItem value="semana">Semana</SelectItem>
            <SelectItem value="mes">Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 h-9 gap-2">
          <Plus className="h-4 w-4" />
          Novo agendamento
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-white border-2 border-white text-[10px]">
              1
            </Badge>
          </Button>
        </div>

        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
