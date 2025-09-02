/**
 * Fixed Asset Type Definition
 * Represents a fixed asset in the accounting system
 */

export interface FixedAsset {
  /**
   * Unique identifier for the fixed asset
   */
  id: string;

  /**
   * Name of the fixed asset
   */
  assetName: string;

  /**
   * Description of the fixed asset
   */
  description?: string;

  /**
   * Category of the fixed asset
   */
  assetCategory: 'buildings' | 'equipment' | 'vehicles' | 'furniture' | 'computers' | 'machinery' | 'land' | 'other';

  /**
   * Date when the asset was purchased
   */
  purchaseDate: Date | string;

  /**
   * Original purchase cost of the asset
   */
  purchaseCost: number;

  /**
   * Current value of the asset after depreciation
   */
  currentValue: number;

  /**
   * Method used for depreciation calculation
   */
  depreciationMethod: 'straight-line' | 'declining-balance' | 'double-declining' | 'units-of-production' | 'sum-of-years';

  /**
   * Useful life of the asset in years
   */
  usefulLife: number;

  /**
   * Estimated salvage value at the end of useful life
   */
  salvageValue: number;

  /**
   * Physical location of the asset
   */
  location?: string;

  /**
   * Current status of the asset
   */
  status: 'active' | 'inactive' | 'disposed' | 'lost' | 'sold';

  /**
   * Additional notes about the asset
   */
  notes?: string;

  /**
   * Date when the asset was added to the system
   */
  createdAt?: Date | string;

  /**
   * Date when the asset was last updated
   */
  updatedAt?: Date | string;
}

/**
 * Fixed Asset Form Input Type
 * Used for creating/updating fixed assets
 */
export type FixedAssetFormInput = Omit<FixedAsset, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Fixed Asset Status Options
 */
export const FIXED_ASSET_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'disposed', label: 'Disposed' },
  { value: 'lost', label: 'Lost/Stolen' },
  { value: 'sold', label: 'Sold' },
] as const;

/**
 * Fixed Asset Category Options
 */
export const FIXED_ASSET_CATEGORY_OPTIONS = [
  { value: 'buildings', label: 'Buildings' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'furniture', label: 'Furniture & Fixtures' },
  { value: 'computers', label: 'Computers & Software' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'land', label: 'Land' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * Depreciation Method Options
 */
export const DEPRECIATION_METHOD_OPTIONS = [
  { value: 'straight-line', label: 'Straight Line' },
  { value: 'declining-balance', label: 'Declining Balance' },
  { value: 'double-declining', label: 'Double Declining' },
  { value: 'units-of-production', label: 'Units of Production' },
  { value: 'sum-of-years', label: 'Sum of the Years\' Digits' },
] as const;
