export enum CoreStates {
  none,
  loading,
  loaded,
  creating,
  created,
  sending,
  sent,
  responseFailed,
  editing,
  error
}

export enum TradeFilterSection {
  keyword = 1,
  price,
  region,
  district,
  tin,
  category,
  product,
  date,
  status,
  hasBid,
  bidType,
  searchProduct,
  productCodeKeyword,
  customerTin,
  providerTin,
  customerTypeId,
  productCode,
  dealId,
  mainKeyword,
  ratingProviderName,
  ratingProviderInn,
  ratingCategory,
  ratingRegion,
  ratingRateRange,
  Customer_Name,
  Provider_Name,
  Price_Range,
  productCodeInput,
  dateWithoutTime,
  lot_id,
  contract_name,
  provider_Inn
}

export enum FileType {
  image = 1,
  doc,
  video
}

export enum LicenseStatus {
  Active = 1,
  Passiva = 2
}

export enum OfferStatuses {
  New = 1,
  Accepted = 2,
  Denied = 3,
  Deleted = 4,
  Published = 5,
  Closed = 6,
  OutOfStock = 7,
  Expired = 8,
  DeletedByProvider = 44,
  InsufficientFunds = 45,
  AutoModeration = 9,
  AutoModerationProlonget = 10
}

export enum CustomerType {
  none,
  budget,
  corporate
}

export enum LotProviderType {
  Offerent = 1,
  Provider = 2
}

export enum ShopLotStatus {
  New = 1,
  Completed = 2
}

export enum DealStatus {
  New = 1,
  Paid = 2,
  Delivered = 3,
  Terminated = 4,
  Restored = 5
}

export enum PublicFilterSection {
  keyword = 1,
  category_product,
  price_range,
  region_district,
  product_search
}

export enum CabinetFilterSection {
  keyword = 1,
  category_product,
  region_district
}
