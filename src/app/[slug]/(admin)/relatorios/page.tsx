import { Card } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function RelatoriosPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 pt-20">
      <div className="p-4 bg-primary/10 rounded-full">
        <Construction className="h-10 w-10 text-primary" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Em breve</h1>
        <p className="text-muted-foreground">A funcionalidade de relatórios está sendo preparada para você.</p>
      </div>
    </div>
  )
}
