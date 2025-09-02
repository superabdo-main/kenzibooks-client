import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatKenzibooksEmail } from "@/lib/auth-utils";

const inputVariants = {
  focus: {
    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)",
    transition: { duration: 0.2 }
  },
  initial: {
    boxShadow: "0 0 0 0px rgba(99, 102, 241, 0)"
  }
};

export function SignInForm({
  className,
  onSubmit,
  isLoading,
  ...props
}: {
  className?: string;
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formatKenzibooksEmail(formData.get('email') as string);
    const password = formData.get('password') as string;
    onSubmit({ email, password });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="border-0 shadow-lg dark:shadow-gray-800/20">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={emailFocused ? "focus" : "initial"}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex">
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="yourname"
                        className="pl-10 rounded-r-none focus-visible:ring-1 focus-visible:ring-offset-0"
                        required
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                      />
                      <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted/50 text-sm text-muted-foreground">
                        @kenzibooks.com
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={passwordFocused ? "focus" : "initial"}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>
            <Link
              href="/auth/signup"
              className="w-full"
            >
              <Button 
                variant="outline" 
                className="w-full h-10 text-base font-medium"
              >
                Create an account
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
