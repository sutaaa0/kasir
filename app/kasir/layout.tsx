import SidebarKasir from "@/components/SidebarKasir"
import HeaderKasir from "@/components/HeaderKasir"
import { Container } from "@/components/ui/container"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-primary">
      <SidebarKasir />
      <div className="flex-1 flex flex-col">
        <HeaderKasir />
        <main className="flex-1 p-6">
          <Container className="h-full bg-white">{children}</Container>
        </main>
      </div>
    </div>
  )
}
