import {
  BaseListing,
  CustomerLotListProperties,
  IdNameModel,
  OfferCommonList,
  OfferFiles,
  SendFileModel
} from '../../../core/models/common.models';
import { CoreStates } from '../../../core/models/enum.models';

export class OfferAddEdit {
  // product_id: number;
  signed_data: string;
  signature: string;
  product_code: string;
  category_id: number;
  price: number;
  amount: number;
  //unit_id: number;
  min_delivery_amount: number;
  max_delivery_amount: number;
  producer_country_id: number;
  is_local_manufacturer: boolean;
  shelf_life: number;
  shelf_life_period_id: number;
  guarantee_period: number;
  guarantee_period_id: number;
  delivery_term: number;
  delivery_term_period_id: number;
  issue_year: number;
  issue_date: string;
  is_licensed: boolean;
  license_id: number;
  product_mark: string;
  product_mark_id: number;
  product_manafacturer: string;
  product_manafacturer_id: number;
  main_image_id: number;
  publish_type_id: number;
  offer_id: number;
  js_offer_delivery_district: JsRegionDistrict[];
  conditions: string;
  record_id: number;
  js_files: SendFileModel[] = [];
  js_properties: OfferAddEditProperties[];

  old_id: number;
  display_on_shop: number;
  display_on_national: number;
  offer_type: number;
}

export class OfferAddEditProperties {
  property_num: number;
  property_value: number;
}

export class OfferList extends OfferAddEdit {
  id: number;
  user_id: number;
  status_id: number;
  start_date: Date;
  end_date: Date;
  created_date: Date;
  mod_date: Date;
  note: string;
  product_name: string;
  unit_name: string;
  producer_country_name: string;
  shelf_life_name: string;
  guarantee_period_name: string;
  delivery_term_period_name: string;
  status_name: string;

  rn: number;
  total_count: number;
}

export class JsRegionDistrict {
  region_id: number;
  district_id: number;
}

export class JsConditionDetail {
  condition_detail_id: number;
  item_value: string;
}

export class JsCondition {
  condition_id: number;
  js_values: JsConditionDetail[];
}

export class IdNameTreeModel {
  id: number;
  name: string;
  children: IdNameTreeModel[];
  selected: boolean;
  region_id: number;
}

export class ChildElement {
  id: number;
  name: string;
}

export class ParentElement {
  parentNodeId: number;
  parentNodeTxt: string;
  childNodes: ChildElement[];
}

export class IdNameModelTree {
  id: number;
  name: string;
  children: IdNameModelTreeChild[];
}

export class IdNameModelTreeChild {
  id: number;
  name: string;
}

export class AddLicense {
  name: string;
  start_date_format: string;
  end_date_format: string;
  old_id: number;
  type_id: number;
  file_id: number;
}

export class RivalLotList extends BaseListing {
  lot_id: number;
  lot_display_no: string;
  offer_id: number;
  offer_display_no: string;
  invite_date: Date;
  start_date: Date;
  end_date: Date;
  amount: number;
  price: number;
  cost: number;
  product_name: string;
  category_Name: string;
  unit_name: string;
  bid_date_ini: Date;
  bid_price: number;
  bid_type_id: number;
  is_local_manufacturer: number;

  js_properties: CustomerLotListProperties[];
}

export class LotDetails extends OfferCommonList {
  is_license_required: number;
  lot_amount: number;
  lot_start_date: Date;
  lot_end_date: Date;
  js_lot_delivery_district: string;
  bid_date_ini: Date;
  bid_price: number;
  main_image_id: number;
  bid_type_id: number;
  pcp_count: number;
  rest_time: number;
  is_rival: number;
  lot_status_id: number; //1- new (active)
  lot_status_name: string;
  lot_note: string;
  lot_display_no: string;
  js_files: OfferFiles[];
  js_conditions: OfferConditionItem[];
  js_properties: LotDetailsProperties[];
  offer_display_no: string;
  issue_date: Date;
}

export class LotDetailsProperties {
  property_name: string;
  user_value: string;
  user_value_id: number;
  pnum: number;
}

export class AddBid {
  lot_id: number;
  price: number;
  record_id: number;
  js_files: SendFileModel[] = [];
  signature: string;
  signed_data: string;
}

export class OfferStatus {
  status_id: number;
  status_name: string;
  count: number;
}

export class BaseOffer extends BaseListing {
  display_no: string;
  display_on_national: number;
  display_on_shop: number;
  id: number;
  product_name: string;
  status_name: string;
  amount: number;
  passed: number;
  passed_seconds: number;
  passed_seconds_date: string;
  js_properties: CustomerLotListProperties[];
}

export class OfferDeletedByProvider extends BaseOffer {
  base_amount: number;
  price: number;
  start_date: Date;
  end_date: Date;
}

export class OfferDenied extends BaseOffer {
  price: number;
  created_date: Date;
  act_date: string;
  note: string;
  extra_note: string;
  js_notes: IdNameModel[] | null = [];
  unit_name: string;
  employee_name: string;
  employee_region_name: string;
  employee_email: string;
  employee_phone: string;
  employee_department_name: string;
}

export class OfferNew extends BaseOffer {
  base_amount: number;
  price: number;
  created_date: Date;
  unit_name: string;
}

export class OfferClosed extends BaseOffer {
  base_amount: number;
  price: number;
  start_date: Date;
  end_date: Date;
  unit_name: string;
}

export class OfferPublished extends BaseOffer {
  base_amount: number;
  price: number;
  start_date: Date;
  end_date: Date;
  unit_name: string;
  can_delete: boolean;
}

export class OfferOutOfStock extends BaseOffer {
  base_amount: number;
  price: number;
  start_date: Date;
  end_date: Date;
  unit_name: string;
}

export class OfferExpired extends BaseOffer {
  base_amount: number;
  price: number;
  start_date: Date;
  end_date: Date;
  unit_name: string;
  can_delete: boolean;
  is_checked: boolean = false;
}

export class SendExpiredChecked {
  signed_Data: string;
  signature: string;
  ids: any;
}

export class OfferAccepted extends BaseOffer {
  base_amount: number;
  price: number;
  start_date: Date;
  end_date: Date;
  unit_name: string;
}

export class ProductMark {
  id: number;
  name: string;
}

export class ProductManafacturer {
  id: number;
  name: string;
}

export class OfferConditionItem {
  condition_id: number;
  condition_name: string;
  js_details: ConditionDetailItem[];
}

export class ConditionDetailItem {
  keyword: string;
  value: string;
}

export class ProviderDeal extends BaseListing {
  amount: number;
  id: number;
  date_ini: Date;
  lot_id: number;
  offer_id: number;
  cost: number;
  status_name: string;
  deadline_color_status: string;
  status_id: number;
  message_count: number;
  provider_id: number;
  customer_id: number;
  customer_name: string;
  payment_error_message: string;
  customer_inn: string;
  product_name: string;
  currency_name: string;
  reason_name: string;
  lot_amount: number;
  penalty_id: number;
  unit_id: number;
  unit_name: string;
  deadline: Date;

  terminate_date: Date;
  payment_date: Date;
  delivery_date: Date;
  restore_date: Date;
  terminate_term: number;
  payment_term: number;
  delivery_term: number;
  restore_term: number;
  has_active_terminate: number;
  has_terminate_history: number;
  state: CoreStates = CoreStates.none;
  can_discount: boolean;
  is_local_manufacturer: number;
  has_discount_history: number;
  has_active_discount: number;
  has_active_restore: number;
  has_restore_history: number;
  js_properties: CustomerLotListProperties[];
}

export class RivalStats {
  is_local_manufacturer: number;
  count: number;
  manufacturer_type_name: string;
}

export class OfferEditModel {
  id: number;
  category_id: number;
  // product_id: number;
  product_code: string;
  product_name: string;
  price: number;
  issue_date: string;
  amount: number;
  base_amount: number;
  unit_id: number;
  unit_name: string;
  min_delivery_amount: number;
  max_delivery_amount: number;
  producer_country_id: number;
  producer_country_name: string;
  is_local_manufacturer: number;
  user_id: number;
  status_id: number;
  status_name: string;
  start_date: Date;
  end_date: Date;
  created_date: Date;
  mod_date: Date;
  shelf_life: number;
  shelf_life_period_id: number;
  shelf_life_name: string;
  guarantee_period: number;
  guarantee_period_id: number;
  guarantee_period_name: string;
  delivery_term: number;
  delivery_term_period_id: number;
  delivery_term_period_name: string;
  issue_year: number;
  is_licensed: number;
  note: string;
  old_id: number;
  license_id: number;
  condition: string;
  mark_id: number;
  manufacturer_id: number;
  record_id: number;
  main_image_id: number;
  typ_publish_id: number;
  js_delivery_districts: OfferEditModelDeliviries[];
  js_files: OfferEditFiles[];
  js_properties: OfferAddEditProperties[];
  display_on_shop: number;
  display_on_national: number;
  offer_type: number;
}

export class OfferEditProperties {
  property_num: number;
  property_value: string;
}

export class OfferEditFiles {
  file_id: number;
  file_name: string;
  file_path: string;
  file_ext: string;
  custom_name: string;
  ext_type_id: number;
}

export class OfferEditModelDeliviries {
  id: number;
  name: number;
  children: OfferEditDeliveryChild[];
}

export class OfferEditDeliveryChild {
  id: number;
  name: string;
  region_id: number;
}

export enum OffersStatusText {
  WaitingModeration = 1,
  WaitingPublish = 2,
  Denied = 3,
  Deleted = 4,
  Published = 5,
  OutOfStock = 7,
  Expired = 8,
  DeletedByProvider = 44
}

export class ProductWithPropsListProperties {
  name: string;
  is_required: number;
  pnum: number;
  items: PropertyItems[];
  user_value: number;
}

export class PropertyItems {
  value: number;
  value_name: string;
}

export class ProductWithPropsList extends BaseListing {
  id: number;
  name: string;
  category_id: number;
  type_id: number;
  category_name: string;
  product_code: string;
  js_properties: ProductWithPropsListProperties[];
}
