export interface UiAction<T = string> {
  id: T;
  label: string;
  class?: string;
  icon?: string;
  hidden?: boolean;
  disabled?: boolean;
}
