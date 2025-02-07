import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";
import React from "react";

const ProtectedKasirPage = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  const level = user?.level;

  if (!user) {
    redirect("/login");
  } else if (level !== "PETUGAS") {
    redirect("/kasir");
  }

  return <>{children}</>;
};

export default ProtectedKasirPage;