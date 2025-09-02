import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Export Fixed Assets types
export type {
  FixedAsset,
  FixedAssetFormInput,
  FIXED_ASSET_STATUS_OPTIONS,
  FIXED_ASSET_CATEGORY_OPTIONS,
  DEPRECIATION_METHOD_OPTIONS,
} from "./fixed-assets.type";

// Export Chart of Accounts types
export type { ChartOfAccount } from "./coa.type";
