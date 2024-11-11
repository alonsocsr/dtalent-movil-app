export interface User {
  id: number;
  initials: string;
  lastLogin: Date;
  isSuperuser: boolean;
  username: string;
  firstName: string;
  lastName: string;
  nationality: string;
  email: string;
  fullName: string;
  role: string;
  dateJoined: Date;
  createdAt: Date;
  modifiedAt: Date;
  address: string;
  phoneNumber: string;
  employeeNumber: number;
  requiredPasswordChange: boolean;
}

export interface Receipt {
  id: number;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
  fullDate: string;
  year: number;
  month: number;
  type: string;
  isSended: boolean;
  isReaded: boolean;
  isSigned: boolean;
  sendedDate: string | null;
  readedDate: string | null;
  signedDate: string | null;
  employee: number;
  employeeFullName: string;
  employeeNumber: string;
}

export interface ApiReceiptResponse {
  numPages: number;
  totalCount: number;
  perPage: number;
  next: string | null;
  previous: string | null;
  count: number;
  fullFilterIds: number[];
  results: Receipt[];
}