"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Calendar, 
  Globe, 
  CreditCard, 
  ArrowDownCircle, 
  BarChart3, 
  Users, 
  UserSquare2, 
  Scissors, 
  Megaphone,
  ChevronDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sidebarItems = [
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Comandas", href: "/comandas", icon: CreditCard },
  { name: "Despesas", href: "/despesas", icon: ArrowDownCircle },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Profissionais", href: "/profissionais", icon: UserSquare2 },
  { name: "Serviços", href: "/servicos", icon: Scissors },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
]

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const slug = params.slug as string

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <img src="/favicon.png" alt="Diana Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-xl font-bold text-foreground leading-none">Diana</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Recepcionista</p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1">Dica da Diana</p>
          <p className="text-xs text-muted-foreground leading-relaxed">Área para treinar o agente de acordo com o salão</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname.includes(item.href)
          return (
            <Link
              key={item.name}
              href={`/${slug}${item.href}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-5", isActive ? "text-white" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground truncate w-24">Salão Beleza & Cia</p>
              <p className="text-xs text-muted-foreground">Administradora</p>
            </div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  )
}
