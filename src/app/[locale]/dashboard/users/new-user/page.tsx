"use client";

import { UserForm } from "@/components/user/user-form";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { ChevronLeft, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NewUserPage() {
  const t = useTranslations("Users");

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link href="/dashboard/users">
            <ChevronLeft className="h-4 w-4" />
            {t("backToUsers")}
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="bg-muted/30 py-5 border-b border-border">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              {t("newUser.title")}
            </CardTitle>
          </div>
          <CardDescription className="pt-1.5">
            {t("newUser.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
} 