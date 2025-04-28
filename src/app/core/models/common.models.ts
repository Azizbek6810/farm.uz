import { CoreStates, FileType } from "./enum.models";
import { JsRegionDistrict } from "../../pages/cabinet/provider/provider.models";

export class ListItemModel {
  rn: number;
  total_count: number;
}

export class ListFilter {
  typeid: number;
  from: number;
  to: number;
  keyword: string;
  name: string;
  region: string;
  inn: string;
  group: string;
  rate_From: string;
  rate_To: string;
  tax_gap: number;
  sub_user_id: number;
  Price_From: number;
  Price_To: number;
  date_From: string;
  date_To: string;
  Customer_Name: string;
  Provider_Name: string;
  region_Name: string;
}

export class ProductsFilter extends ListFilter {
  price_from: number;
  price_to: number;
  region_id: number;
  region_name: string;
  district_id: number;
  district_name: string;
  prod_search_name?: string;
  category_id: number;
  category_name: string;
  // product_id: number;
  product_code: string;
  product_name: string;
  producer_country_id: number = 244;
  producer_country_name: string;
  min_delivery: number;
  max_delivery: number;
  is_local_manufacturer: number = 1;
}

export class OfferCommonList extends ListItemModel {
  id: number;
  display_no: string;
  // product_id: number;
  product_code: string;
  product_name: string;
  price: number;
  amount: number;
  currency_name: string;
  currency_id: number;
  comment_count: number;
  base_amount: number;
  producer_country_name: string;
  min_delivery_amount: number;
  max_delivery_amount: number;
  status_id: number;
  status_name: string;
  delivery_term: number;
  delivery_term_period_name: string;
  unit_id: number;
  unit_name: string;
  start_date: Date;
  end_date: Date;
  is_local_manufacturer: boolean;
  user_id: number;
  issue_year: number;
  is_licensed: boolean;
  license_id: number;
  license_name: string;
  license_end_date: string;
  license_start_date: string;
  license_type_id: number;
  license_type_name: string;
  offer_license_files: OfferFiles[];
  offer_js_properties: any[];
  shelf_life: number;
  shelf_life_name: string;
  guarantee_period: number;
  guarantee_period_name: string;
  mark_name: string;
  manufacturer_name: string;
  category_name: string;
  condition: string;
  thumb_image: any;
  image_loaded = false;
}

export class OfferWithMainFile extends OfferCommonList {
  main_image_id: number;
  file_name: string;
  file_path: string;
  file_ext: string;
}

export class CustomerOffer extends OfferCommonList {
  main_image_id: number;
  js_files: OfferFiles[];
  js_properties: CustomerLotListProperties[];
}

export class CustomerLotListProperties {
  property_name: string;
  user_value: string;
  user_value_id: number;
  pnum: number;
}

export class OfferFiles {
  file_id: number;
  file_name: string;
  file_path: string;
  file_ext: string;
  selected: boolean;
  custom_name: string;
  thumb_image: any;
  main_image: any;
  average_image: any;
}

export class AddLot {
  signed_data: string;
  signature: string;
  offer_id: number;
  amount: number;
  record_id: number;
  account_id: number;
  account: string;
  // plan_id: number;
  plangraph_detail_id: number;
  is_local_manufacturer: number;
  expenditure_id: number;
  expenditure_name: string;
  customer_type_id: number;
  is_Auto_Plangraph?: number;
  Expenditure_Id?: number;
  Kazna_Account?: string;
  js_regions_districts: JsRegionDistrict[];
}

export class PlangraphList {
  id: number;
  name: string;
  date_ini: Date;
  plangraph_detail_id: number;
  quantity: number;
  used_quantity: number;
  rest_quantity: number;
  season_name: string;
  year_id: number;
  month_name: string;
  year_name: string;
  product_name: string;
  category_name: string;
  kazna_account: string;
  kazna_account_id: number;
  expenditure_id: number;
  expenditure_name: string;
  js_properties: PlanGraphPropertyModel[] = [];
}

export class AddLotPledgeCommission {
  start_cost: number;
  bid_cost: number;
}

export class PledgeCommissionItem {
  pledge: number;
  commission: number;
}

export class AccountItem {
  id: number;
  account_number: string;
}

export class ExpenditureItem {
  id: number;
  name: string;
  tnved: string;
}


export class PlanGraphPropertyModel {
  pname: string;
  pnum: number;
  pval: number;
  pvalname: string;
  checked: boolean = false;
}

export class FrontOfferListItemModel {
  id: number;
  display_no: string;
  product_code: string;
  product_name: string;
  price: number;
  category_id?: number;
  amount: number;
  producer_country_name: string;
  file_ext: string;
  file_name: string;
  file_path: string;
  currency_name: string;
  unit_name: string;
  image_loaded = false;
  thumb_image: any;
  date_ini: Date;
  date_publish: string;
}

export class FilterResult {
  category_name: string;
  product_name: string;
}

export class FrontProductDetails {
  id: number;
  product_code: string;
  product_name: string;
  price: number;
  is_show_popup_taxgap: number;
  currency_name: string;
  amount: number;
  min_delivery_amount: number;
  max_delivery_amount: number;
  base_amount: number;
  producer_country_name: string;
  is_local_manufacturer: boolean;
  status_id: number;
  status_name: string;
  delivery_term: number;
  delivery_term_period_name: string;
  issue_date: Date;
  start_date: Date;
  end_date: Date;
  is_licensed: boolean;
  shelf_life: number;
  shelf_life_name: string;
  guarantee_period: number;
  guarantee_period_name: string;
  mark_name: string;
  manufacturer_name: string;
  category_name: string;
  condition: string;
  display_no: string;
  display_on_national: number;
  display_on_shop: number;
  has_lot: boolean;
  main_image_id: number;
  js_files: OfferFiles[];
  js_properties: CustomerLotListProperties[];
  offer_license_files: OfferFiles[];
  license_name: string;
  license_type_name: string;
  comment_count: number;
}

export class KeyItem {
  key: string;
  value: string;
}

export class SubUserRoleModel {
  customer_type: number;
  owner_name: string;
  short_name: string;
  user_id: number;
  selected_branch: number;
  branches: SubUserBranch[] = [];
}

export class SubUserBranch {
  customer_type: number;
  fullname: string;
  manager_id: number;
  role_id: number;
  role_name: string;
  sub_user_id: number;
}

export class BaseListing {
  rn: number;
  total_count: number;
}

export class IdNameModel {
  id: number;
  name: string;
}

export class SendFileModel {
  file_id: number;
  file_custom_name: string;
  type_id: number;
}

export class ProviderOffersFilter extends ListFilter {
  display_on_national: number = 0;
  display_on_shop: number = 0;
  is_local_manufacturer?: number = 0;
  category_id: number;
  // product_id: number;
  product_code: string;
  date_from_format: string;
  date_to_format: string;
}

export class TradeFilterModel extends ListFilter {
  tin: string;
  category_id: number;
  currency_name: string;
  currency_id: number;
  // product_id: number;
  product_code: string;
  deal_Id: string;
  provider_Inn: string;
  region_id: number;
  region_ids: number[];
  district_id: number;
  date_from: string;
  date_to: string;
  date_from_format: Date;
  date_to_format: Date;
  date_end: string;
  status_id: number;
  has_bid_id: number;
  bid_type_id: number;
  customer_type_id: number;
  customer_tin: string;
  provider_tin: string;
  display_on_shop: number;
  Is_On_Discussion: number;
  type_id: number;
  display_on_national: number;
}

export class ICategoryListModel {
  category_id: number;
  category_name: string;
  products: IProductItemModel[];
}

export class IProductItemModel {
  order_num: number;
  product_name: string;
  product_code: string;
  picture_path: string;
  thumb_image: any;
  image_loaded: boolean;
}


export class FolderList extends ListFilter {
  folder_id?: number;
  file_types: FileType[] = [];
}

export class CommentFilter extends ListFilter {
  section_id: number;
  element_id: number;
}

export class FolderModel extends IdNameModel {
  total_count: number;
  cnt: number;
  modified_date: string;
}


export class FileModel {
  custom_name: string;
  date_ini: string;
  ext: string;
  file_size: number;
  id: number;
  name: string;
  path: string;
  rn: number;
  selected = false;
  state: CoreStates = CoreStates.none;
  total_count: number;
  ext_type_id: number;
  fileBlob: any;
}

export class License extends ListItemModel {
  id: number;
  name: string;
  start_date: Date;
  end_date?: Date;
  user_id: number;
  created_date: Date;
  mod_date: Date;
  status_id: number;
  old_id: number;
  gost_id?: number;
  gost_tnvd?: number;
  license_type_name?: string;
  gost_product_name?: string;
}

export class RegionDistrict {
  id: number;
  name: string;
  children: RegionDistrict[];
  region_id: number;
  selected: boolean;
}

export class DeliveryParent {
  regionId: number;
  regionName: string;
  children: DeliveryChild[];
}

export class DeliveryChild {
  districtId: number;
  districtName: string;
  regionId: number;
}

export const VIDEO_FILE_EXTENSIONS = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'drc', 'gifv', 'avi', 'mts', 'm2ts', 'ts', 'mov', 'qt', 'wmv', 'yuv', 'rm', 'rmvb', 'viv',
  'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mpeg', 'm2v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'];

export const DOCUMENT_FILE_EXTENSIONS = ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb', 'xls', 'xlt', 'xlm', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xla',
  'xlam', 'xll', 'xlw', 'ppt', 'pot', 'pps', 'pptx', 'pptm', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm', 'accdb', 'accde', 'accdt', 'accdr', 'pub', 'xps', 'prn', 'txt', 'text', 'csv', 'dif', 'slk', 'dbf', 'ods', 'pdf', 'xps', 'ps', 'eps', 'prn'];

export const IMAGE_FILE_EXTENSIONS = ['tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'gif', 'png'];

export class IdNameNoteModel extends IdNameModel {
  note: string;
}

export class UserRecord extends BaseListing {
  record_id: number;
  record_text: string;
  amount: number;
  currency_code: string;
}

export class MapStats {
  region_id: number;
  region_name: string;
  active_proposal_count: number;
  today_proposal_count: number;
  current_year_deals_count: number;
  current_year_deals_sum: number;
  last_month_deals_count: number;
  last_month_deals_sum: number;
}

export const TimeLimitItems: LimitItem[] = [
  <LimitItem>{ name: "10", value: 10 },
  <LimitItem>{ name: "20", value: 20 },
  <LimitItem>{ name: "30", value: 30 },
  <LimitItem>{ name: "40", value: 40 },
];

export class LimitItem {
  name: string;
  value: number;
}

export class TerminatedDealModel {
  created_date: string;
  created_user_id: number;
  created_user_inn: string;
  created_user_name: string;
  currency_id: number;
  currency_name: string;
  deal_id: number;
  expire_date: string;
  id: number;
  penalty_cost: number;
  penalty_id: number;
  penalty_name: string;
  receiver_user_id: number;
  receiver_sub_user_id: number;
  receiver_user_inn: string;
  receiver_user_name: string;
  reason_name: string;
  rn: number;
  start_price: number;
  status_id: number;
  status_name: string;
  total_count: number;
  cost: number;
  price: number;
  lot_display_no: string;
}

export class DealDestroyModel {
  deal_id: number;
  deastroy_type_id: number;
  dealId: number;
  penaltyId: number;
  reason_Id: number;
  penalty_id: number;
  signed_data: string;
  signature: string;
}

export class DealInvoiceDetails {
  signed_Data: string;
  signature: string;
  deal_Id: number;
  invoice: string;
  invoice_Date: string;
  invoice_Id: string;
}

export class IPenaltyModel {
  penalty_cost: number;
  no_penalty_cost: number;
  currency_name: string;
  is_show_penalty: number;
}

export class DealProviderInfo {
  provider_name: string;
  provider_inn: string;
  provider_pinfl: string
}

export class LotRoadmap {
  id: number;
  name: string;
  title: string;
  parent_id: number;
  is_checked: boolean;
  is_active: boolean;
  date_ini: Date;
  note: string;
  next_lot_id?: number;
  prev_lot_id?: number;
  next_lot_display_no: string;
  prev_lot_display_no: string;
  rn: number;
}

export class IProviderListModel extends BaseListing {
  provider_name: string;
  provider_inn: string;
  region_name: string;
  js_products: string;
  cert_start_date: string;
  cert_number: string;
  cert_end_date: string;
  tnved: string;
  products: IProviderProducts[] = [];
}

export class CertificatesListModel extends BaseListing {
  category_name: string;
  certificate: string
  end_date: Date;
  id: number;
  mod_date: Date;
  product_code: string;
  product_name: string;
  start_date: Date;
}

export class IProviderProducts {
  category_name: string;
  product_name: string;
  product_code: string;
}
