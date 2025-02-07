// app/penjualan/TransactionForm.tsx
'use client';

import { handleTransaction } from '@/server/actions';
import React, { useTransition } from 'react';

type Produk = {
  produkId: number;
  namaProduk: string;
  harga: number;
};

type TransactionFormProps = {
  produkList: Produk[];
};

const formStyles: { [key: string]: React.CSSProperties } = {
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '2px solid #000',
    fontSize: '1rem',
    boxSizing: 'border-box',
    background: '#fff',
  },
  button: {
    width: '100%',
    padding: '15px',
    background: '#000',
    color: '#fff',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '5px 5px 0px 0px #000',
  },
};

export default function TransactionForm() {
  const [isPending] = useTransition();

  return (
    // Method POST diperlukan agar data form dikirim melalui body
    <form onSubmit={() => handleTransaction()}>
      <h2>Data Pelanggan</h2>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Nama Pelanggan:</label>
        <input type="text" name="namaPelanggan" style={formStyles.input} required />
      </div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Alamat:</label>
        <input type="text" name="alamat" style={formStyles.input} required />
      </div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Nomor Telepon:</label>
        <input type="text" name="nomorTelepon" style={formStyles.input} required />
      </div>
      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Jumlah Produk:</label>
        <input type="number" name="jumlahProduk" style={formStyles.input} min="1" required />
      </div>
      <button type="submit" style={formStyles.button} disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
      </button>
    </form>
  );
}
