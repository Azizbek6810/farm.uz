import { BaseListing, CustomerLotListProperties, TradeFilterModel } from "src/app/core/models/common.models";
import { CoreStates } from "src/app/core/models/enum.models";

export class LeftMenu {
  id: number;
  routeLink: string;
  icon: string;
  title: string;
  showHeader = true;
  isHide = false;
  hasChild = false;
  redirectToOtherSite = false;
  hrLine = false;
  className = "";
  budgeCount = 0;
  subMenu: LeftMenu[] = [];
}

export class IUserInfo {
  email: string;
  username: string;
  accredited_date: Date;
  inn: string;
  name: string;
  region_name: string;
  district_name: string;
  phone: string;
  street: string;
  zip: string;
}

export class CustomerLotItems extends BaseListing {
  id: number;
  status_name: string;
  producer_country_name: string;
  product_name: string;
  mark_name: string;
  price: number;
  lot_id: number;
  lot_display_no: string;
  lot_amount: number;
  lot_start_date: Date;
  lot_end_date: Date;
  lot_note: string;
  unit_name: string;
  is_local_manufacturer: number;
  is_local_manufacturer_name: string;
  js_properties: CustomerLotListProperties[];
  status_id: number; // 3 -> discount, 15-kazna_reject
  has_discount_history: number;
  has_active_discount: number;
  customer_moderation_note: string;
}

export class IsLocalFilter extends TradeFilterModel {
  is_local_manufacturer: number;
}

export class CustomerDeal extends BaseListing {
  amount: number;
  id: number;
  date_ini: Date;
  lot_display_no: string;
  deadline_color_status: string;
  lot_id: number;
  offer_id: number;
  message_count: number;
  cost: number;
  currency_name: number;
  status_name: string;
  status_id: number;
  provider_id: number;
  customer_id: number;
  provider_name: string;
  customer_name: string;
  payment_error_message: string;
  provider_inn: string;
  customer_inn: string;
  product_name: string;
  lot_amount: number;
  unit_id: number;
  unit_name: string;
  reason_name: string;
  deadline: Date;
  rest_payment: number;
  penalty_id: number;

  terminate_date: Date;
  payment_date: Date;
  payment_error_date: Date;
  delivery_date: Date;
  restore_date: Date;
  terminate_term: number;
  payment_yerm: number;
  delivery_term: number;
  restore_term: number;
  has_active_terminate: number;
  has_terminate_history: number;
  is_dom: number;
  state: CoreStates = CoreStates.none;
  is_local_manufacturer: number;
  can_discount: boolean;
  is_pay_btn: number;
  has_active_discount: number;
  has_discount_history: number;
  has_active_restore: number;
  has_restore_history: number;
  js_properties: CustomerLotListProperties[];
  is_kazna_error: number;
  is_payment_error: number;
  kazna_error_text: string;
  kazna_date: string;
}

export class DealPaymentModel {
  signed_data: string;
  signature: any;
  deal_id: number;
  record_id: number;
}
