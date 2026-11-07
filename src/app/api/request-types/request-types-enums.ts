export enum RequestCategory {
  Employee = 1,
  Supervisor = 2,
  General = 3,
  Document = 4
}


export enum RequestState {
  Active = 1,
  Inactive = 2
}


export enum AttributeType {
  Text = 1,
  Dropdown = 2,
  Checkbox = 3,
  Date = 4
}

export type PageMode = 'add' | 'edit' | 'view';
