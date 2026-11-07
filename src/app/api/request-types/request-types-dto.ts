import { AttributeType, RequestCategory, RequestState } from './request-types-enums';


export interface CustomAttribute {
  id: string;
  name: string;
  type: AttributeType;
  isRequired: boolean;
  maxLength?: number | null;
  dropdownItems?: string[];
  order: number;
}

export interface CustomSection {
  id: string;
  name: string;
  order: number;
  attributes: CustomAttribute[];
}

export interface EscalationSettings {
  singleSignatureTimeout: number | null;
  escalateTo: string | null;
  requestTimeoutBeforeSignaling: number | null;
  signalingRole: string | null;
}

export interface ReminderSettings {
  signatureReminderInterval: number | null;
  requestReminderInterval: number | null;
}


export interface RequestType {
  id: string;
  name: string;
  alternateName: string;
  category: RequestCategory | null;
  state: RequestState;
  isCustom: boolean;
  defaultReport: string | null;
  postingRole: string | null;
  backdatedRequestLimit: number;
  escalation: EscalationSettings | null;
  reminders: ReminderSettings | null;
  customSections: CustomSection[];
}