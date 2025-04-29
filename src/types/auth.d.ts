export interface LoginRequest {
  userName: string;
  pass: string;
  playerId: string;
  customerTyp: number;
  appVer: string;
  xCustomerCode: string;
  isAppConfig: boolean;
}

export interface UserInfo {
  usrId: number;
  nam: string;
  admin: boolean;
  hasPaySystemPerm: boolean;
  customerId: number;
  chartId: number;
  orgUnitId: number;
  orgUnitName: string;
  hasCartablePermission: boolean;
  hasMySalaryPermission: boolean;
  token: string;
}

export interface AppConfig {
  id: number;
  acc_System: number;
  systemTitle: string;
  acc_Year: number;
  saleStock: boolean;
  hasStock: boolean;
  txtStock: boolean;
  getQuantity: boolean;
  getOffer: boolean;
  hasDecimal: boolean;
  getAmount: boolean;
  urlImage: string;
  urlProductImages: string;
  urlCategoryImages: string;
  logoUrl: string;
  userDisplayName: string;
  perms: string;
}

export interface AuthState extends LoginRequest {
  token: string | null;
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  appConfig: AppConfig | null;
  setField: (field: keyof LoginRequest, value: any) => void;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setAppConfig: (appConfig: AppConfig) => void;
  logout: () => void;
} 