// components/UpdatePelangganModal.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Schema validasi untuk pelanggan
const FormSchema = z.object({
  namaPelanggan: z.string().min(2, {
    message: "Nama pelanggan minimal 2 karakter",
  }),
  alamat: z.string().min(2, {
    message: "Alamat minimal 2 karakter",
  }),
  nomorTelepon: z.string().regex(/^\d+$/, "Nomor telepon harus berupa angka"),
})

type UpdatePelangganModalProps = {
  pelanggan: { pelangganId: number; namaPelanggan: string; alamat: string; nomorTelepon: string } | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: number, namaPelanggan: string, alamat: string, nomorTelepon: string) => void
}

export function UpdatePelangganModal({ pelanggan, isOpen, onClose, onUpdate }: UpdatePelangganModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      namaPelanggan: pelanggan?.namaPelanggan || "",
      alamat: pelanggan?.alamat || "",
      nomorTelepon: pelanggan?.nomorTelepon || "",
    },
  })

  useEffect(() => {
    if (pelanggan) {
      form.reset({
        namaPelanggan: pelanggan.namaPelanggan,
        alamat: pelanggan.alamat,
        nomorTelepon: pelanggan.nomorTelepon,
      })
    }
  }, [pelanggan, form])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (pelanggan) {
      onUpdate(pelanggan.pelangganId, data.namaPelanggan, data.alamat, data.nomorTelepon)
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold mb-4">Update Pelanggan</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama Pelanggan */}
            <FormField
              control={form.control}
              name="namaPelanggan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelanggan</FormLabel>
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

            {/* Alamat */}
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
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

            {/* Nomor Telepon */}
            <FormField
              control={form.control}
              name="nomorTelepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
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