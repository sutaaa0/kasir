"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Register } from "@/server/actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const FormSchema = z
  .object({
    username: z.string().min(1, { message: "Nama tidak boleh kosong." }),
    password: z.string().min(8, { message: "Kata sandi minimal 8 karakter." }),
    confirmPassword: z.string(),
    level: z.string().min(1, { message: "Tolong pilih level pengguna." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak sesuai.",
    path: ["confirmPassword"],
  });

export default function FormRegister() {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      level: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
      const response = await Register(data.username, data.password, data.level);

      if (response.status === "Success") {
        toast({
          title: "Success",
          description: "Berhasil mendaftarkan pengguna baru.",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal mendaftarkan pengguna baru.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-4 border-black shadow-400 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Daftar Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">Nama</FormLabel>
                    <FormControl>
                      <input {...field} className="w-full border-black border-2 p-2.5 focus:outline-none text-grey-400 focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" placeholder="Nama" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input {...field} type={showPassword ? "text" : "password"} placeholder="Kata Sandi" className="w-full border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30%] text-grey-400 hover:text-foreground">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">Konfirmasi Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input {...field} type={showPassword ? "text" : "password"} placeholder="Konfirmasi Kata Sandi" className="w-full border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30%] text-grey-400 hover:text-foreground">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">Level Pengguna</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger >
                          <SelectValue  placeholder="Pilih level pengguna"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PETUGAS">Petugas</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full bg-white hover:bg-[#fff9d4] justify-center px-4 py-3" type="submit">
                 Daftar
              </Button>
            </form>
          </Form>

          <p className="text-center text-muted-foreground mt-4">
            Sudah punya akun? <Link href="/login" className="text-foreground hover:underline">Masuk</Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
