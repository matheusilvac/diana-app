"use client"

import { Bell, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
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

export function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-white sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-medium">
            Hoje
          </Button>
          <div className="flex items-center border border-input rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r border-input">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-secondary p-1.5 rounded-md transition-colors">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">20 de maio de 2024</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <Select defaultValue="dia">
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

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
