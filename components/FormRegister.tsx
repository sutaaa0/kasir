"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Register } from "@/server/actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";


const FormSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  level: z.string().min(1, { message: "Please select a user level." }), 
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
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
      level: "" ,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {

      console.log(data);
      const response = await Register(data.username, data.password, data.level);

      if (response.status === "Success") {
        toast({
          title: "Success",
          description: "Successfully registered new user.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to register new user.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Sign Up</h1>
          {/* <p className="mt-2 text-sm text-muted-foreground">
            Please enter your details to register
          </p> */}
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Nama</FormLabel>
                  <FormControl>
                  <input {...field} className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" placeholder="Nama" />
                    {/* <Input placeholder="Username" {...field} /> */}
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
                  <FormLabel className="text-lg font-medium">Kata Sandi</FormLabel>
                  <FormControl>
                  <div className="relative">
                    <input {...field}  type={showPassword ? "text" : "password"} placeholder="Kata Sandi" {...field}className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff]  active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30%] text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Kunci Kata Sandi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input {...field}  type={showPassword ? "text" : "password"} placeholder="Kunci Kata Sandi" {...field}className="w-[25rem] border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#a6c2ff]  active:shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30%] text-muted-foreground hover:text-foreground">
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
                  <FormLabel className="text-lg font-medium">User Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                      <SelectValue placeholder="Select user level" />
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

            <Button className="text-xl font-semibold w-full bg-white text-black hover:bg-white/90" type="submit">
              Daftar
            </Button>
          </form>
        </Form>

        <p className="text-center text-lg text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

