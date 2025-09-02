"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
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
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const t = useTranslations('Error');

  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-10">
      <Card className="w-full max-w-2xl shadow-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-destructive">{t('title')}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src="/error.svg"
              alt="Error Illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground mb-2">{t('error_code')} {error.digest}</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t('message')}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => reset()}
            className="gap-2"
          >
            <RefreshCcw size={16} />
            {t('try_again')}
          </Button>
          <Button 
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <Home size={16} />
            {t('back_to_dashboard')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
