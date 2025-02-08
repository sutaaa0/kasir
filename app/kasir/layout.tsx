import { Container } from "@/components/ui/container"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-primary">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <Container className="h-full bg-white">{children}</Container>
        </main>
      </div>
    </div>
  )
}
