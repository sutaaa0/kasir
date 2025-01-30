// app/pelanggan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addPelanggan, deletePelanggan, getPelanggans, updatePelanggan } from "@/server/actions";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UpdatePelangganModal } from "@/components/UpdatePelangganModal";

type Pelanggan = {
  pelangganId: number;
  namaPelanggan: string;
  alamat: string;
  nomorTelepon: number;
};

const FormSchema = z.object({
  namaPelanggan: z.string().min(2),
  alamat: z.string().min(2),
  nomorTelepon: z.string(),
});

export default function PelangganPage() {
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pelangganToDelete, setPelangganToDelete] = useState<number | null>(null);
  const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      namaPelanggan: "",
      alamat: "",
      nomorTelepon: "",
    },
  });

  useEffect(() => {
    fetchPelanggans();
  }, []);

  const fetchPelanggans = async () => {
    const pelanggans = await getPelanggans();
    setPelanggans(pelanggans);
  };

  const handleOnSubmit = async (data: z.infer<typeof FormSchema>) => {
    const namaPelanggan = data.namaPelanggan;
    const alamat = data.alamat;
    const nomorTelepon = Number(data.nomorTelepon);
    const newPelanggan = await addPelanggan(namaPelanggan, alamat, nomorTelepon);
    if (newPelanggan.code === 200) {
      toast({
        variant: "success",
        title: "Success",
        description: "Pelanggan berhasil ditambahkan",
      });
      fetchPelanggans();
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan pelanggan",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setPelangganToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pelangganToDelete) {
      const result = await deletePelanggan(pelangganToDelete);
      if (result.code === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: "Pelanggan berhasil dihapus",
        });
        fetchPelanggans();
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Pelanggan gagal dihapus",
        });
      }
    }
    setConfirmDialogOpen(false);
  };

  const handleUpdateClick = (pelanggan: Pelanggan) => {
    setSelectedPelanggan(pelanggan);
    setIsModalOpen(true);
  };

  const handleUpdatePelanggan = async (id: number, namaPelanggan: string, alamat: string, nomorTelepon: number) => {
    try {
      const result = await updatePelanggan(id, namaPelanggan, alamat, nomorTelepon);
      if (result.code === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: "Pelanggan berhasil diperbarui",
        });
        fetchPelanggans();
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Pelanggan gagal diperbarui",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">Manajemen Pelanggan</h2>
      <Container className="bg-secondary">
        <div className="flex gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex gap-12 justify-center items-center">
              <FormField
                name="namaPelanggan"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pelanggan</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nama Pelanggan" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="alamat"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Alamat" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="nomorTelepon"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Nomor Telepon" />
                    </FormControl>
                  </FormItem>
                )}
              />{" "}
              <Button type="submit" className="bg-primary hover:bg-primary/80 mt-6">
                <Plus className="mr-2 h-5 w-5" /> Tambah Pelanggan
              </Button>
            </form>
          </Form>
        </div>
      </Container>

      <Container noPadding>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead>Nama Pelanggan</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Nomor Telepon</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pelanggans?.map((pelanggan) => (
              <TableRow key={pelanggan.pelangganId}>
                <TableCell>{pelanggan.namaPelanggan}</TableCell>
                <TableCell>{pelanggan.alamat}</TableCell>
                <TableCell>{pelanggan.nomorTelepon}</TableCell>
                <TableCell>
                  <Button className="mr-2 bg-primary hover:bg-primary/80" size="sm" onClick={() => handleUpdateClick(pelanggan)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600" size="sm" onClick={() => handleDelete(pelanggan.pelangganId)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      <ConfirmDialog isOpen={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} onConfirm={handleConfirmDelete} message="Are you sure you want to delete this pelanggan?" />

      <UpdatePelangganModal pelanggan={selectedPelanggan} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpdate={handleUpdatePelanggan} />
    </div>
  );
}