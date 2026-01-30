import { LucideIcon } from "lucide-react";
// ===============================next APP props types ========================//

import { AnyMongoAbility } from "@casl/ability";
import { ReactElement, ReactNode } from "react";

export interface AclGuardProps {
  children: ReactNode;
  aclAbilities: ACLObj;
}

export type Actions = "manage" | "create" | "read" | "update" | "delete";

export interface ACLObj {
  action: Actions;
  subject: string;
}

export type NextPage<P = {}> = ((props: P) => ReactElement | null) & {
  acl?: ACLObj;
  setConfig?: () => void;
  contentHeightFixed?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

// ==================== Authcontext types =========================== //

export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
  role: string;
  mobile: string;
  address: string;
  state: string;
  city: string;
  pan_no?: string;
  aadhar_no?: string;
  register_pin: string;
  referral_id?: string;
};

interface Option {
  id: string;
  name: string;
  value: string;
}

interface Role {
  id: string;
  name: string;
  value: string;
  options: Option[];
}

export type UserDataType = {
  id: number;
  wallet?: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  options: string[];
  mobile: string;
  address: string;
  city: string;
  state: string;
  pan_no: string;
  aadhar_no: string;
  register_pin: string | null;
  status: number;
  api_token: string;
};

export type AuthValuesType = {
  logout: () => void;
  user: UserDataType | null;
  setUser: (value: UserDataType | null) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
  authLoading: boolean;
  setAuthLoading: (value: boolean) => void;
};

export type AbilityContextvalue = {
  ability: AnyMongoAbility | undefined;
  setAbility: (updatedSettings: AnyMongoAbility | undefined) => void;
};

//=============================== grid===========================//

export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

//-----------------layout------------------//
export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  subject: string;
  children?: MenuItem[];
}
