import { z } from 'zod';

export const coaFormSchema = z.object({
  accountType: z.string({
    required_error: 'Account type is required',
  }),
  accountDetail: z.string({
    required_error: 'Account detail is required',
  }),
  accountName: z.string({
    required_error: 'Account name is required',
  }),
  description: z.string().optional(),
  balance: z.string().refine(
    (val) => {
      if (!val) return true; // Allow empty string
      return !isNaN(Number(val.replace(/[^0-9.-]+/g, '')));
    },
    {
      message: 'Must be a valid number',
    }
  ),
  payOf: z.string().optional(),
});

export type CoaFormValues = z.infer<typeof coaFormSchema>;

export const defaultFormValues: Partial<CoaFormValues> = {
  accountType: '',
  accountDetail: '',
  accountName: '',
  description: '',
  balance: '',
  payOf: '',
};
