'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select';
import { Calendar } from '@/components/shadcn-ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn-ui/popover';
import { coaFormSchema, type CoaFormValues } from '@/lib/schemas/coa-schema';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface CoaFormProps {
  initialData?: Partial<CoaFormValues>;
  onSubmit: (data: CoaFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function CoaForm({ initialData, onSubmit, isSubmitting = false }: CoaFormProps) {
  const t = useTranslations('coa');
  const router = useRouter();

  const form = useForm<CoaFormValues>({
    resolver: zodResolver(coaFormSchema),
    defaultValues: {
      accountType: '',
      accountDetail: '',
      accountName: '',
      description: '',
      balance: '',
      payOf: '',
      ...initialData,
    },
  });

  const handleSubmit = async (data: CoaFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Type */}
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.accountType.label')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.accountType.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asset">{t('form.accountType.options.asset')}</SelectItem>
                    <SelectItem value="liability">
                      {t('form.accountType.options.liability')}
                    </SelectItem>
                    <SelectItem value="equity">{t('form.accountType.options.equity')}</SelectItem>
                    <SelectItem value="revenue">{t('form.accountType.options.revenue')}</SelectItem>
                    <SelectItem value="expense">
                      {t('form.accountType.options.expense')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account Detail */}
          <FormField
            control={form.control}
            name="accountDetail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('form.accountDetail.label')}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.accountDetail.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">{t('form.accountDetail.options.cash')}</SelectItem>
                    <SelectItem value="bank">{t('form.accountDetail.options.bank')}</SelectItem>
                    <SelectItem value="credit">
                      {t('form.accountDetail.options.credit')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account Name */}
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.accountName.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.accountName.placeholder')}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.description.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.description.placeholder')}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Balance */}
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.balance.label')}</FormLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('form.balance.placeholder')}
                      {...field}
                      className="pl-8 w-full"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pay Of */}
          <FormField
            control={form.control}
            name="payOf"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('form.payOf.label')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>{t('form.payOf.placeholder')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            {t('form.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('form.buttons.saving') : t('form.buttons.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
