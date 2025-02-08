"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { getPurchases } from "@/server/actions";

type ProductDetail = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type Purchase = {
  id: number;
  date: string;
  customer: string;
  total: number;
  details: ProductDetail[];
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const data = await getPurchases();
        setPurchases(data);

        console.log("data yang diterima :",data)
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    }
    fetchPurchases();
  }, []);

  return (
    <div className="space-y-6 p-6">
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
  );
}
