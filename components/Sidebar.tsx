import Link from "next/link"
import { Users, ShoppingBag, FileText, UserCircle, Home, BarChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "./ui/container"

const Sidebar = () => {
  return (
    <Container className="w-64 h-full bg-secondary p-4">
      <nav className="space-y-2">
        <Link href="/dashboard/home" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <Home className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Beranda</span>
          </Button>
        </Link>
        <Link href="/dashboard/products" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <ShoppingBag className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Barang</span>
          </Button>
        </Link>
        <Link href="/dashboard/users" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <Users className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Pengguna</span>
          </Button>
        </Link>
        <Link href="/dashboard/purchases" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <FileText className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Riwayat Pembelian</span>
          </Button>
        </Link>
        <Link href="/dashboard/customers" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <UserCircle className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Pelanggan</span>
          </Button>
        </Link>
        <Link href="/dashboard/reports" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <BarChart className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Laporan Keuangan</span>
          </Button>
        </Link>
        <Link href="/dashboard/rules" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <Settings className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Peraturan</span>
          </Button>
        </Link>
      </nav>
    </Container>
  )
}

export default Sidebar