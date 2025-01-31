"use client";
import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login } from "@/server/actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
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
        toast({
          title: "Success",
          description: "Successfully registered new user.",
        });

        router.push("/");

        console.log(newUser);
      } else {
        toast({
          title: "Error",
          description: "Failed to register new user.",
        });

        console.log(newUser);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Halo! Selamat Kembali</h1>
          {/* <h2 className="mt-1 text-1xl font-semi text-muted-foreground">Login your account</h2> */}
          <p className="mt-2 text-lg text-muted-foreground ">Login ke akunmu</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Nama</FormLabel>
                    <FormControl>
                      <input {...field} className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" placeholder="Nama" />
                    </FormControl>
                    {/* <FormDescription>Ini adalah nama tampilan publik Anda.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="relative space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input {...field}  type={showPassword ? "text" : "password"} placeholder="Kata Sandi" {...field}className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff]  active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30%] text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    {/* <FormDescription>Ini adalah kata sandi pribadi Anda.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                Lupa password?
              </Link>
            </div> */}

            <Button className="text-xl font-semibold w-full" type="submit">
              Masuk
            </Button>
          </form>
        </Form>

        <p className="text-center text-lg text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-foreground hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
