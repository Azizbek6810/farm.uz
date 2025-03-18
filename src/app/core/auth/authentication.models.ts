export class TokenInfo {
  sessionId: number;
  login: string;
  authority: string;
  pinfl: string;
  tin: string;
  clientId: number;
  clientType: number; // 1-jur, 2-ChP, 3-fiz, 8-filial, 6-budget
  accrediteId: number;
  language: string;
  exp: number;
  iat: number;
  subRole: string;
  sub_user_id: number;
  manager_id: number;
  head_user_id: number;
  sub_user_type_id: number;
  nbf: number;
}

export class UserRoleType {
  user_id: number;
  name: string;
  inn: string;
  type_id: number;
  type_code: string;
  code?: string;
  type_name: string;
  bindName: string;
}

export class UserInfo {
  role_id: RoleType;
  role_code: string;
  role_codes: string[] = [];
  role_name: string;
  role_names: string[] = [];
  name: string;
}

export enum RoleType {
  None,
  Customer = 1,
  Provider = 2
}

export class IdCodeModel {
  id: number;
  code: string;
}

export class SmsActionsModel {
  phone: string;
  actions: IdCodeModel[] = [];
}

export class UserRoleModel {
  customer_type: number;
  role_id: number;
  user_id: number;
  role_name: string;
  fullname: string;
  name_code: string;
  short_name: string;
  customer_type_name: string;
}
