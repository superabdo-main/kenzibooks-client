'use client';

import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { LockIcon, Home, ArrowLeft, ShieldAlert } from "lucide-react";

interface NoPermissionProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  customAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }
}

export default function NoPermission({
  title,
  description,
  showBackButton = true,
  showHomeButton = true,
  customAction
}: NoPermissionProps) {
  const router = useRouter();
  const t = useTranslations('Permissions');
  
  // Go back to previous page
  const handleBack = () => {
    router.back();
  };
  
  // Go to dashboard
  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-10">
      <Card className="w-full max-w-2xl shadow-lg mx-auto border-amber-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-amber-600">
            {title || t('access_denied')}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {description || t('no_permission_description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center">
          <div className="relative w-full h-48 md:h-64">
            <Image
              src="/error.svg"
              alt="Access Denied Illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t('contact_admin')}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              {t('go_back')}
            </Button>
          )}
          
          {showHomeButton && (
            <Button 
              onClick={handleGoHome}
              className="gap-2"
            >
              <Home size={16} />
              {t('go_to_dashboard')}
            </Button>
          )}
          
          {customAction && (
            <Button 
              onClick={customAction.onClick}
              variant="default"
              className="gap-2"
            >
              {customAction.icon}
              {customAction.label}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 