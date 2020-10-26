export interface IBase {
  id?: string;
  orgId?: string;
  parentId?: string;
  name?: string;
  label?: string;
  success?: boolean;
  message?: string;
  errors?: string[];
  componentType?: string;
  clientTimestamp?: string;
  isDeleted?: boolean;
}

export interface IConfiguration extends IBase {
  cards: ICard[];
  description?: string;
  isTemplate?: boolean;
}

export interface ICard extends IBase {
  order: number;
  options: IOption[];
  enabled: boolean;
  configurationId: string;
  productId?: string;
}

export interface IOption extends IBase {
  value: string;
  unitPrice?: number;
  totalAmount?: number;
  selected: boolean;
  quantity?: number;
  productId?: string;
  order: number;
  isDefault: boolean;
  groupName: string;
  discount?: number;
  cardId: string;
  listPrice: number;
}

export interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  postalCode?: string;
  comments?: string;
}

export interface IWattChangeEvent {
  value: string;
  price: number;
}
