export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum AssetModule {
  PORTFOLIO = 'PORTFOLIO',
  PROFILE = 'PROFILE',
  BOOKING = 'BOOKING',
  DOCUMENTS = 'DOCUMENTS',
}

export interface AssetUploadInput {
  id: string;
  asset: any;
  type: AssetType;
}

export interface Asset {
  id: string;
  url: string;
  type: AssetType;
  success?: boolean;
  error?: string;
}

export interface AssetUploadOptions {
  dir: string;
}
