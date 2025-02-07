// app/penjualan/TransactionForm.tsx
'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Import fungsi aksi server, pastikan handleTransaction menerima data form
import { handleTransaction } from '@/server/actions';

// Import komponen UI dari shadcn (sesuaikan path dengan struktur proyek Anda)
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Definisikan schema validasi menggunakan zod
const transactionSchema = z.object({
  namaPelanggan: z.string().min(1, { message: 'Nama Pelanggan wajib diisi' }),
  alamat: z.string().min(1, { message: 'Alamat wajib diisi' }),
  nomorTelepon: z.string().min(1, { message: 'Nomor Telepon wajib diisi' }),
  // Karena input type="number" mengembalikan string, kita akan melakukan transformasi ke number
  jumlahProduk: z
    .preprocess((val) => Number(val), z.number().min(1, { message: 'Jumlah Produk minimal 1' })),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function TransactionForm() {
  const [isPending, startTransition] = useTransition();

  // Inisialisasi react-hook-form dengan zod resolver
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      namaPelanggan: '',
      alamat: '',
      nomorTelepon: '',
      jumlahProduk: 1,
    },
  });

  // Fungsi submit yang memanggil aksi server
  const onSubmit = async (data: TransactionFormValues) => {
    startTransition(() => {
      // Pastikan handleTransaction di sisi server sudah sesuai untuk menerima data form
      handleTransaction(data);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-bold">Data Pelanggan</h2>

        <FormField
          control={form.control}
          name="namaPelanggan" // Perhatikan nama field, pastikan konsisten dengan defaultValues dan schema (disini gunakan "namaPelanggan")
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pelanggan:</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama pelanggan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat:</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan alamat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomorTelepon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon:</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nomor telepon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jumlahProduk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Produk:</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
        </Button>
      </form>
    </Form>
  );
}
