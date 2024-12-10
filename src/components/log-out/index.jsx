"use client";
import { Button } from "../ui/button";
import { logOutAction } from "@/actions";

const Logout = () => {
  const handleLogOut = async () => {
    await logOutAction();
  };
  return <Button onClick={handleLogOut}>Logout</Button>;
};

export default Logout;
