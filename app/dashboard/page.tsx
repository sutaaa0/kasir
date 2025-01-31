import { Container } from "@/components/ui/container"
import { getCurrentUser } from "@/server/actions"
import { Users, ShoppingBag, FileText, UserCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function DashboardPage() {

  const user = await getCurrentUser()
    const level = user?.level

    if(!user) {
      redirect('/login')
    }else if(level !== "ADMIN") {
      redirect('/kasir')
    }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Container className="bg-neo-pink">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Total Pengguna</h3>
          <Users className="h-8 w-8" />
        </div>
        <p className="text-4xl font-bold">100</p>
      </Container>

      <Container className="bg-neo-yellow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Total Produk</h3>
          <ShoppingBag className="h-8 w-8" />
        </div>
        <p className="text-4xl font-bold">500</p>
      </Container>

      <Container className="bg-neo-green">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Total Pembelian</h3>
          <FileText className="h-8 w-8" />
        </div>
        <p className="text-4xl font-bold">1000</p>
      </Container>

      <Container className="bg-neo-purple">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Total Pelanggan</h3>
          <UserCircle className="h-8 w-8" />
        </div>
        <p className="text-4xl font-bold">250</p>
      </Container>
    </div>
  )
}

