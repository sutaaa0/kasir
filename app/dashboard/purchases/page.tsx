"use client"

import { useState } from "react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"

type ProductDetail = {
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

type Purchase = {
  id: number
  date: string
  customer: string
  total: number
  details: ProductDetail[]
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([
    { 
      id: 1, 
      date: "2023-06-01", 
      customer: "John Doe", 
      total: 150000,
      details: [
        {
          productId: 1,
          productName: "Laptop ASUS X441MA",
          quantity: 2,
          price: 50000,
          subtotal: 100000
        },
        {
          productId: 2,
          productName: "Mouse Wireless",
          quantity: 1,
          price: 50000,
          subtotal: 50000
        }
      ]
    },
    { 
      id: 2, 
      date: "2023-06-02", 
      customer: "Jane Smith", 
      total: 200000,
      details: [
        {
          productId: 3,
          productName: "Keyboard Mechanical",
          quantity: 1,
          price: 200000,
          subtotal: 200000
        }
      ]
    },
  ])

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">Riwayat Pembelian</h2>

      <Container noPadding>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>{purchase.customer}</TableCell>
                <TableCell>Rp {purchase.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    className="bg-primary hover:bg-primary/80" 
                    size="sm"
                    onClick={() => setSelectedPurchase(purchase)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      {/* Modal Detail Pembelian */}
      <Dialog
        open={!!selectedPurchase}
        onOpenChange={(open) => !open && setSelectedPurchase(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pembelian</DialogTitle>
          </DialogHeader>
          
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Tanggal Pembelian</p>
                  <p>{selectedPurchase.date}</p>
                </div>
                <div>
                  <p className="font-medium">Nama Pelanggan</p>
                  <p>{selectedPurchase.customer}</p>
                </div>
                <div>
                  <p className="font-medium">Total Pembelian</p>
                  <p>Rp {selectedPurchase.total.toLocaleString()}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchase.details.map((detail) => (
                    <TableRow key={detail.productId}>
                      <TableCell>{detail.productName}</TableCell>
                      <TableCell>Rp {detail.price.toLocaleString()}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>Rp {detail.subtotal.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}