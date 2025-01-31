import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  const level = user?.level;

  if (!user) {
    redirect("/login");
  } else if (level !== "PETUGAS") {
    redirect("/kasir");
  }

  return <div>page</div>;
};

export default page;