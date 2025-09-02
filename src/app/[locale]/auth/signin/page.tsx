"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast({
          title: "Error",
          description:
            "Failed to sign in. Please check your credentials and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You have successfully signed in!",
          variant: "default",
        });
        router.push("/manage-organizations");
      }
    } catch (error) {
      toast({
        title: "Internal Error",
        description:
          "Failed to sign in. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
      </div>
    </div>
  );
}
