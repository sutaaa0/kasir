import Link from "next/link"
import { ShoppingBag, FileText, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "./ui/container"

const Sidebar = () => {
  return (
    <Container className="w-64 h-full bg-secondary p-4">
      <nav className="space-y-2">
        <Link href="/dashboard/products" className="w-full">
          <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
            <ShoppingBag className="w-5 h-5 mr-4" />
            <span className="flex-grow text-left">Produk</span>
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
      </nav>
    </Container>
  )
}

export default Sidebar

