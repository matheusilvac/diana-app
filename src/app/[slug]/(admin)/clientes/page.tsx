"use client"

import * as React from "react"
import { clients } from "@/lib/mocks"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FadeIn } from "@/components/fade-in"

export default function ClientesPage() {
  return (
    <FadeIn>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie a base de clientes do seu salão.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <Card className="bg-white border-border">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, e-mail ou telefone..." className="pl-9 h-10 border-border bg-secondary/20" />
          </div>
          <Button variant="outline" className="gap-2 h-10 border-border">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead className="text-center">Agendamentos</TableHead>
              <TableHead>Último</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="cursor-pointer group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                <TableCell className="text-muted-foreground">{client.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-secondary font-medium">
                    {client.appointmentsCount}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{client.lastAppointment}</TableCell>
                <TableCell>
                  <Badge 
                    variant={client.status === "Ativo" ? "default" : "secondary"}
                    className={cn(
                      "font-medium",
                      client.status === "Ativo" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-slate-100 text-slate-500 border-slate-200"
                    )}
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Mostrando 5 de 150 clientes</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 border-border" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 border-border">Próximo</Button>
          </div>
        </div>
      </Card>
    </div>
    </FadeIn>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ")
}
