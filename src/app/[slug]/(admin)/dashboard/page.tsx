import { redirect } from "next/navigation"

export default async function DashboardPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  
  if (!slug || slug === "undefined") {
    redirect("/")
  }
  
  redirect(`/${slug}/agenda`)
}
