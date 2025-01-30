"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Schema validasi untuk produk
const FormSchema = z.object({
  namaProduk: z.string().min(2, {
    message: "Nama produk minimal 2 karakter",
  }),
  harga: z.number().int().positive({
    message: "Harga harus bilangan bulat positif",
  }),
  stok: z.number().int().nonnegative({
    message: "Stok tidak boleh negatif",
  }),
})

type UpdateProductModalProps = {
  product: { produkId: number; namaProduk: string; harga: number; stok: number } | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: number, namaProduk: string, harga: number, stok: number) => void
}

export function UpdateProductModal({ product, isOpen, onClose, onUpdate }: UpdateProductModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      namaProduk: product?.namaProduk || "",
      harga: product?.harga || 0,
      stok: product?.stok || 0,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        namaProduk: product.namaProduk,
        harga: product.harga,
        stok: product.stok,
      })
    }
  }, [product, form])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (product) {
      onUpdate(product.produkId, data.namaProduk, data.harga, data.stok)
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold mb-4">Update Produk</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama Produk */}
            <FormField
              control={form.control}
              name="namaProduk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black focus:bg-[#FFA6F6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Harga */}
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black focus:bg-[#FFA6F6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stok */}
            <FormField
              control={form.control}
              name="stok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black focus:bg-[#FFA6F6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={onClose}
                className="bg-white border-2 border-black hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/80">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}