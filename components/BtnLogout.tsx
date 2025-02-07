"use client";
import React from "react";
import { toast } from "@/hooks/use-toast";
import { Logout } from "@/server/actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const LogoutBtn = () => {
    const router = useRouter();

  const handleLogout = async () => {
    try {
      const log = await Logout();

      if (log.status === "Success") {
        toast({
          title: "Logout Berhasil",
          description: "Anda telah keluar",
        });

        // Use router.push instead of redirect
        router.push("/login");
        // Force a page refresh to clear client state
        router.refresh();
      }
    } catch (error) {
      if (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat logout",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <Button size="sm" className="transform rotate-1 bg-red-500" onClick={handleLogout}>
      Keluar
    </Button>
  );
};

export default LogoutBtn;