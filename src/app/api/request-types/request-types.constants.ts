import { RequestCategory, AttributeType } from './request-types-enums';

export interface OptionItem<T> {
  label: string;
  value: T;
}

export const CATEGORY_LABELS: Record<RequestCategory, string> = {
  [RequestCategory.Employee]: 'Employee',
  [RequestCategory.Supervisor]: 'Supervisor',
  [RequestCategory.General]: 'General',
  [RequestCategory.Document]: 'Document'
};

export const CATEGORY_OPTIONS: OptionItem<RequestCategory>[] = [
  { label: 'Employee', value: RequestCategory.Employee },
  { label: 'Supervisor', value: RequestCategory.Supervisor },
  { label: 'General', value: RequestCategory.General },
  { label: 'Document', value: RequestCategory.Document }
];

export const ATTRIBUTE_TYPE_OPTIONS: OptionItem<AttributeType>[] = [
  { label: 'Text', value: AttributeType.Text },
  { label: 'Drop down', value: AttributeType.Dropdown },
  { label: 'Check box', value: AttributeType.Checkbox },
  { label: 'Date', value: AttributeType.Date }
];