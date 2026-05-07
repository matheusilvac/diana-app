import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="p-8 bg-[#F7F7F8] min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
