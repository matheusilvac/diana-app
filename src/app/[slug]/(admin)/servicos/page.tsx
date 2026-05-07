"use client"

import * as React from "react"
import { services } from "@/lib/mocks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Clock, Tag, MoreVertical, Edit3, Trash2 } from "lucide-react"
import { FadeIn } from "@/components/fade-in"

export default function ServicosPage() {
  return (
    <FadeIn>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Serviços</h1>
          <p className="text-sm text-muted-foreground">Gerencie o catálogo de serviços oferecidos.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
          <Plus className="h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button variant="default" size="sm" className="rounded-full bg-primary text-white">Todos</Button>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:bg-secondary">Cabelo</Button>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:bg-secondary">Barbearia</Button>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:bg-secondary">Manicure</Button>
        <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:bg-secondary">Estética</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-white border-border hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">{service.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">{service.name}</h3>
                <p className="text-xs text-muted-foreground">{service.category}</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
                <div className="text-xl font-bold text-primary">
                  {service.price}
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-3 border-t border-border bg-secondary/10 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8">
                <Edit3 className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </FadeIn>
  )
}
