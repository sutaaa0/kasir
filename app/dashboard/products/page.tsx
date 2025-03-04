"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addProduct, deleteProduct, getProducts, updateProduct } from "@/server/actions";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UpdateProductModal } from "@/components/UpdateProdukModal";

type Product = {
  produkId: number;
  namaProduk: string;
  harga: number;
  stok: number;
};

const FormSchema = z.object({
  namaProduk: z.string().min(2),
  harga: z.string(),
  stok: z.string(),
  // Field imageFile berupa base64 string yang bersifat opsional
  imageFile: z.string().optional(),
});

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      namaProduk: "",
      harga: "",
      stok: "",
      imageFile: "",
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const products = await getProducts();
    setProducts(products);
  };

  const handleOnSubmit = async (data: z.infer<typeof FormSchema>) => {
    const nama = data.namaProduk;
    const harga = Number(data.harga);
    const stok = Number(data.stok);
    const imageFile = data.imageFile; // data berupa base64 (jika diunggah)

    const newProduk = await addProduct(nama, harga, stok, imageFile);
    if (newProduk.code === 200) {
      toast({
        variant: "success",
        title: "Success",
        description: "Produk berhasil ditambahkan",
      });
      fetchProducts();
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan produk",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setProductToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const result = await deleteProduct(productToDelete);
      if (result.code === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: "Produk berhasil dihapus",
        });
        fetchProducts();
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Produk gagal dihapus",
        });
      }
    }
    setConfirmDialogOpen(false);
  };

  const handleUpdateClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateProduct = async (id: number, namaProduk: string, harga: number, stok: number) => {
    try {
      const result = await updateProduct(id, namaProduk, harga, stok);
      if (result.code === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: "Produk berhasil diperbarui",
        });
        fetchProducts();
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Produk gagal diperbarui",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fungsi untuk membaca file yang diunggah dan mengubahnya menjadi base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">Manajemen Produk</h2>
      <Container className="bg-secondary">
        <div className="flex gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col gap-6 justify-center items-center">
              <div className="flex gap-12 flex-wrap justify-center">
                <FormField
                  name="namaProduk"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Nama Produk</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nama Produk" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="harga"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Harga</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} placeholder="Harga Produk" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="stok"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Stok</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Stok Produk" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="imageFile"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Image Produk</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => handleFileChange(e, field.onChange)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/80 mt-6">
                <Plus className="mr-2 h-5 w-5" /> Tambah Produk
              </Button>
            </form>
          </Form>
        </div>
      </Container>

      <Container noPadding>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead>Nama Produk</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.produkId}>
                <TableCell>{product.namaProduk}</TableCell>
                <TableCell>Rp {product.harga.toLocaleString()}</TableCell>
                <TableCell>{product.stok}</TableCell>
                <TableCell>
                  <Button className="mr-2 bg-primary hover:bg-primary/80" size="sm" onClick={() => handleUpdateClick(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600" size="sm" onClick={() => handleDelete(product.produkId)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this product?"
      />

      <UpdateProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}
