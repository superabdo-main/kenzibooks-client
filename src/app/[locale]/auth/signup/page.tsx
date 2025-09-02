"use client";

import { SignUpForm } from "@/components/auth/SignUpForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import axios from "axios";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const signupSchema = z.object({
    email: z.string(),
    password: z.string(),
    username: z.string(),
  });

  const handleSignUp = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const validation = signupSchema.safeParse(data);
      if (!validation.success) {
        toast({
          title: "Error",
          description: "Invalid credentials format",
          variant: "destructive",
        });
        return;
      }
      // Call authentication API
      const response = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signup`,
        headers: { "Content-Type": "application/json" },
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
        },
        validateStatus: (status) => status < 500, // Don't throw for 4xx errors
      });

      // Handle authentication failure
      if (response.status !== 201 || !response.data) {
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
        return;
      }
      // On successful sign up
      toast({
        title: "Success",
        description: "Account created successfully! Please sign in.",
        variant: "default",
      });
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign up error:", error);
      throw new Error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignUpForm onSubmit={handleSignUp} loading={isLoading} />
      </div>
    </div>
  );
}
