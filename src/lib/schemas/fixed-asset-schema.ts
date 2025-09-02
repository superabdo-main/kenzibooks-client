import { z } from 'zod';

export const fixedAssetFormSchema = z.object({
  assetName: z.string({
    required_error: 'Asset name is required',
  }),
  description: z.string().optional(),
  purchaseDate: z.string({
    required_error: 'Purchase date is required',
  }),
  purchaseCost: z.string().refine(
    (val) => {
      if (!val) return false;
      return !isNaN(Number(val.replace(/[^0-9.-]+/g, '')));
    },
    {
      message: 'Must be a valid number',
    }
  ),
  assetCategory: z.string({
    required_error: 'Asset category is required',
  }),
  depreciationMethod: z.string({
    required_error: 'Depreciation method is required',
  }),
  usefulLife: z.string().refine(
    (val) => {
      if (!val) return false;
      return !isNaN(Number(val));
    },
    {
      message: 'Must be a valid number',
    }
  ),
  salvageValue: z.string().refine(
    (val) => {
      if (!val) return true; // Optional field
      return !isNaN(Number(val.replace(/[^0-9.-]+/g, '')));
    },
    {
      message: 'Must be a valid number',
    }
  ),
  currentValue: z.string().refine(
    (val) => {
      if (!val) return true; // Optional field
      return !isNaN(Number(val.replace(/[^0-9.-]+/g, '')));
    },
    {
      message: 'Must be a valid number',
    }
  ),
  location: z.string().optional(),
  status: z.string({
    required_error: 'Status is required',
  }),
  notes: z.string().optional(),
});

export type FixedAssetFormValues = z.infer<typeof fixedAssetFormSchema>;

export const defaultFormValues: Partial<FixedAssetFormValues> = {
  assetName: '',
  description: '',
  purchaseDate: '',
  purchaseCost: '',
  assetCategory: '',
  depreciationMethod: '',
  usefulLife: '',
  salvageValue: '',
  currentValue: '',
  location: '',
  status: 'active',
  notes: '',
};
