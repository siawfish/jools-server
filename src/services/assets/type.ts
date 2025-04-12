export enum AssetModule {
  PORTFOLIO = 'PORTFOLIO',
  PROFILE = 'PROFILE',
  BOOKING = 'BOOKING',
  DOCUMENTS = 'DOCUMENTS',
}

export interface AssetUploadInput {
  id: string;
  asset: any;
  type: string;
}

export interface Asset {
  id: string;
  url: string;
  type: string;
  success?: boolean;
  error?: string;
}

export interface AssetUploadOptions {
  dir: string;
}
