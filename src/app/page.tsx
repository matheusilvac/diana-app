"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Scissors, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      router.push("/selecionar-empresa")
    }, 1000)
  }

  const features = [
    { icon: Calendar, text: "Agenda inteligente" },
    { icon: Users, text: "Gestão de clientes" },
    { icon: TrendingUp, text: "Relatórios em tempo real" },
  ]

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Diana Logo" className="w-12 h-12 object-contain brightness-0 invert" />        
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Gestão completa<br />
                para seu salão
              </h2>
              <p className="text-white/70 text-lg max-w-md">
                Agende, organize e grow sua agenda de forma simples e eficiente com inteligência artificial.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <feature.icon className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {["https://i.pravatar.cc/150?u=juliana", "https://i.pravatar.cc/150?u=carlos", "https://i.pravatar.cc/150?u=amanda", "https://i.pravatar.cc/150?u=beatriz"].map((src, i) => (
                <img 
                  key={i}
                  src={src} 
                  alt="" 
                  className="w-10 h-10 rounded-full border-2 border-white/50 object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-white/60 mt-0.5">+500 salões信赖</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/favicon.png" alt="Diana Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Diana</h1>
              <p className="text-xs text-muted-foreground">Sistema para salões</p>
            </div>
          </div>

          <Card className="border-0 shadow-2xl shadow-black/5 bg-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0 font-semibold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Acesso profissional
                </Badge>
                <h2 className="text-2xl font-bold text-foreground">Bem-vindo de volta TESTE</h2>
                <p className="text-sm text-muted-foreground mt-1">Entre para gerenciar seu salão</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 border-border bg-secondary/20 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Senha</label>
                    <button type="button" className="text-xs text-primary hover:underline font-medium">
                      Esqueceu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 border-border bg-secondary/20 focus:bg-white transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <button className="text-primary font-bold hover:underline">
                    Criar conta
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Ao continuar, você aceita nossos{" "}
            <button className="underline hover:text-foreground">Termos</button> e{" "}
            <button className="underline hover:text-foreground">Privacidade</button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
