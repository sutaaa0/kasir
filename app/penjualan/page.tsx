// app/penjualan/page.tsx

import TransactionForm from "@/components/TransactionFrom";
import { prisma } from "@/lib/db";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '5px solid #000',
    boxShadow: '10px 10px 0px 0px #000',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '2rem',
    borderBottom: '3px solid #000',
    paddingBottom: '10px',
  },
};

export default async function PenjualanPage() {
  // Ambil daftar produk untuk dropdown
  const produkList = await prisma.produk.findMany({
    select: { produkId: true, namaProduk: true, harga: true },
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Form Transaksi Kasir</h1>
      <TransactionForm produkList={produkList} />
    </div>
  );
}
