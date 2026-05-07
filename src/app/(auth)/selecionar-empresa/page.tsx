"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  Check,
  LogOut,
  ChevronRight,
  Plus
} from "lucide-react"

const mockCompanies = [
  { 
    id: "salao-beleza-cia", 
    name: "Salão Beleza & Cia", 
    slug: "salao-beleza-cia",
    address: "Rua das Flores, 123 - São Paulo",
    employees: 4,
    avatar: null,
    role: "Administradora"
  },
  { 
    id: "barbearia-do-joao", 
    name: "Barbearia do João", 
    slug: "barbearia-do-joao",
    address: "Av. Principal, 456 - Campinas",
    employees: 2,
    avatar: null,
    role: "Proprietário"
  },
]

export default function SelectCompanyPage() {
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(null)

  const handleContinue = () => {
    if (selectedCompany) {
      router.push(`/${selectedCompany}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Diana Logo" className="w-38 h-auto object-contain" />
          </div>
          <Button variant="ghost" className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0 font-semibold">
            <Building2 className="h-3 w-3 mr-1" />
            Multi-empresa
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Selecione seu negócio
          </h1>
          <p className="text-muted-foreground">
            Você tem acesso a {mockCompanies.length} estabelecimento{mockCompanies.length > 1 ? "s" : ""}. Escolha qual deseja gerenciar.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCompany === company.id 
                    ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/10" 
                    : "hover:border-primary/30"
                }`}
                onClick={() => setSelectedCompany(company.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{company.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {company.address}
                        </div>
                      </div>
                    </div>
                    {selectedCompany === company.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {company.employees} profissionais
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Ativo desde 2023
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Badge variant="secondary" className="bg-secondary/50">
                      {company.role}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      Gerenciar
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Add New Company Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mockCompanies.length * 0.1 }}
          >
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 border-dashed bg-secondary/30">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center min-h-[200px] text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">Adicionar estabelecimento</h3>
                <p className="text-sm text-muted-foreground">
                  Cadastre um novo salão ou barbearia na plataforma
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            size="lg"
            disabled={!selectedCompany}
            onClick={handleContinue}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 gap-2"
          >
            Continuar
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  )
}
