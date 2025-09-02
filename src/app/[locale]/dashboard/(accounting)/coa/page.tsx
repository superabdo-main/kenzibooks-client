"use client";

import { useTranslations } from "next-intl";
import { CoaForm } from '@/features/accounting/components/coa-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useManagementStore } from '@/stores/management.store';
import { useCoaStore } from '@/stores/coa.store';
import { useToast } from '@/hooks/use-toast';
import { CoaFormValues } from '@/lib/schemas/coa-schema';
import { useRouter } from 'next/navigation';

export default function ChartOfAccountsPage() {
  const t = useTranslations('coa');
  const { session } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const organizationId = useManagementStore((state) => state.managedOrganization?.id);
  const { createAccount } = useCoaStore();

  const handleSubmit = async (data: CoaFormValues) => {
    if (!session?.accessToken || !organizationId) {
      toast({
        title: t('error.createError'),
        description: 'Authentication or organization data missing',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createAccount({
        accountType: data.accountType,
        accountDetail: data.accountDetail,
        accountName: data.accountName,
        description: data.description,
        balance: data.balance ? parseFloat(data.balance) : 0,
        payOf: data.payOf,
        accessToken: session.accessToken,
        organizationId,
      });

      if (response.isOk) {
        toast({
          title: t('success.created'),
          description: t('success.created'),
        });
        // You can redirect or refresh the page here if needed
        router.refresh();
      } else {
        throw new Error(response.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: t('error.createError'),
        description: error instanceof Error ? error.message : t('error.createError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CoaForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
