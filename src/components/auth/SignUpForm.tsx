'use client';

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
import { Loader2, Mail, Lock, User, Phone, Check, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatKenzibooksEmail } from "@/lib/auth-utils";

type PasswordStrength = {
  score: number;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
};

type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  loading: boolean;
  className?: string;
};

const inputVariants = {
  focus: {
    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)",
    transition: { duration: 0.2 }
  },
  initial: {
    boxShadow: "0 0 0 0px rgba(99, 102, 241, 0)"
  }
};

const checkPasswordStrength = (password: string): PasswordStrength => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  return {
    score,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  };
};

export function SignUpForm({ onSubmit, loading, className }: SignUpFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    // contact: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
      setPasswordMatch(value === confirmPassword);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      setPasswordMatch(formData.password === value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordMatch) return;
    await onSubmit({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="border-0 shadow-lg dark:shadow-gray-800/20">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Fill in the form to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === 'username' ? "focus" : "initial"}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      className="pl-10"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </motion.div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === 'email' ? "focus" : "initial"}
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
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted/50 text-sm text-muted-foreground">
                        @kenzibooks.com
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Contact Field */}
                {/* <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === 'contact' ? "focus" : "initial"}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="contact"
                      name="contact"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      required
                      value={formData.contact}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('contact')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </motion.div>
                </div> */}

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === 'password' ? "focus" : "initial"}
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
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </motion.div>

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength.score)}`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          {passwordStrength.hasMinLength ? (
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span>8+ characters</span>
                        </div>
                        <div className="flex items-center">
                          {passwordStrength.hasUppercase ? (
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span>Uppercase</span>
                        </div>
                        <div className="flex items-center">
                          {passwordStrength.hasLowercase ? (
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span>Lowercase</span>
                        </div>
                        <div className="flex items-center">
                          {passwordStrength.hasNumber ? (
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span>Number</span>
                        </div>
                        <div className="flex items-center">
                          {passwordStrength.hasSpecialChar ? (
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <X className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span>Special char</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <motion.div
                    className="relative"
                    variants={inputVariants}
                    animate={focusedField === 'confirmPassword' ? "focus" : "initial"}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                      value={confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </motion.div>
                  {!passwordMatch && confirmPassword && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-medium" 
                    disabled={loading || !passwordMatch}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign up
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
                  Already have an account?
                </span>
              </div>
            </div>
            <Link
              href="/auth/signin"
              className="w-full"
            >
              <Button 
                variant="outline" 
                className="w-full h-10 text-base font-medium"
              >
                Sign in
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}