"use client";
import * as React from "react";
// import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login } from "@/server/actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Tolong masukan nama akun anda.",
  }),
  password: z.string().min(8, { message: "Tolong masukan kata sandi akun anda." }),
});

export default function FormLogin() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const newUser = await Login(data.username, data.password);

      if (newUser.status === "Success") {
        toast({ title: "Success", description: "Login berhasil." });
        router.push("/");
      } else {
        toast({ title: "Error", description: "Login gagal." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-300 p-4">
      <Card className="w-full max-w-md shadow-lg border-4 border-black shadow-400 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Halo! Selamat Kembali</CardTitle>
          <p className="text-center text-muted-foreground">Masukan akun anda</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">Nama</FormLabel>
                    <FormControl>
                    <input {...field} className="w-[393px] border-black border-2 p-2.5 bg-[#fff4ae] focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-white active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" placeholder="Nama" />
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
                        <input {...field} type={showPassword ? "text" : "password"} placeholder="Kata Sandi" className="w-[393px] border-black border-2 p-2.5 bg-[#fff4ae] focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-white active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"  />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30%] text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full bg-[#a6c2ff] hover:bg-white justify-center px-4 py-3" type="submit">
                Masuk
              </Button>
            </form>
          </Form>

          {/* <p className="text-center text-muted-foreground mt-4">
            Belum punya akun? <Link href="/register" className="text-foreground hover:underline">Daftar</Link>
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
