"use client";
import { fetchAuthUserAction } from "@/actions";
import Logout from "@/components/log-out";
import { redirect } from "next/navigation";
export default async function Home() {
  const currentUser = await fetchAuthUserAction();

  if (!currentUser.success) redirect("/sign-in");
  return (
    <div>
      <h1>Next JS Authentication</h1>
      <h1>{currentUser?.data?.userName}</h1>
      <p>{currentUser?.data?.email}</p>

      <Logout />
    </div>
  );
}
