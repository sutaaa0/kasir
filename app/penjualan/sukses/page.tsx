// app/penjualan/sukses/page.tsx
export default function SuksesPage() {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Transaksi Berhasil!</h1>
        <p>Data transaksi telah disimpan.</p>
        <a href="/penjualan" style={{ color: '#000', textDecoration: 'underline' }}>
          Kembali ke Form Transaksi
        </a>
      </div>
    );
  }
  