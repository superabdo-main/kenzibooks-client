"use client";
import React, { useState } from "react";
import { Button } from "../shadcn-ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createAuthenticatedFetch } from "@/lib/api";

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (status === "unauthenticated" || !session?.user?.accessToken) {
      toast({
        title: "Please sign in to subscribe",
        description: "You must be signed in to subscribe",
        variant: "destructive",
      });
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.ownedOrganizations?.length! <= 0) {
      toast({
        title: "Error",
        description: "You must create an organization to subscribe",
        variant: "destructive",
      });
      return router.push("/manage-organizations/create");
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await createAuthenticatedFetch({
        accessToken: session?.user?.accessToken,
        endpoint: "/checkout/create-checkout-session",
        options: {
          method: "POST",
          body: JSON.stringify({
            priceId:
              priceId === "starter"
                ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER
                : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL,
            userId: session?.user?.id,
          }),
        },
      });
      if (!response.isOk) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      const data = await response.data;
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="default"
      size="lg"
      className={`w-full text-base font-medium py-5 transition-colors ${"bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md text-white"}`}
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
    </Button>
  );
};

export default SubscribeButton;
