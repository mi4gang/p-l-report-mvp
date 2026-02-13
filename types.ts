
export interface Financials {
  cost: number;
  sale: number;
  margin: number;
}

export interface Container {
  id: string;
  number: string;
  terminal: string;
  cost: number;
  sale: number;
}

export interface LogisticsItem {
  cost: number;
  sale: number;
}

export interface LogisticsInfo {
  id: string;
  spLink: string;
  logistician: string;
  transport: LogisticsItem;
  crane: LogisticsItem;
  extras: LogisticsItem;
}

export interface Deal {
  id: string;
  closeDate: string;
  title: string;
  contact: {
    name: string;
    phone: string;
    id: string;
  };
  manager: string;
  containers: Container[];
  logistics?: LogisticsInfo;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  manager: string;
  logistician: string;
  terminal: string;
}
