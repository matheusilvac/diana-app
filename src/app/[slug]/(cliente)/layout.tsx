import { ClientSidebar } from "@/components/sidebar"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <ClientSidebar />
      <div className="pl-64">
        <main className="p-8 bg-[#F7F7F8] min-h-screen">{children}</main>
      </div>
    </div>
  )
}

