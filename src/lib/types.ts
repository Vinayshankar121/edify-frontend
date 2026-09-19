export type Role = "admin" | "cashier";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: Role;
}

export interface AdminUser extends AuthUser {
  password: string;
}

export interface Cashier {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  aadhaar: string;
  admissionDate: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherPhone: string;
  motherEmail: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  address: string;
  academicYear: string;
  className: string;
  section: string;
  rollNo: string;
  previousClass: string;
  previousSchool: string;
  feeCategory: string;
  structureId: string;
  discount: number;
}

export interface SchoolClass {
  id: string;
  name: string;
  sections: string[];
}

export interface FeeHead {
  name: string;
  amount: number;
}

export interface FeeStructure {
  id: string;
  name: string;
  className: string;
  academicYear: string;
  active: boolean;
  heads: FeeHead[];
}

export interface FeeTerm {
  id: string;
  structureId: string;
  name: string;
  amount: number;
  dueDate: string;
}

export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer";

export interface Payment {
  id: string;
  receiptNo: string;
  studentId: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  remarks: string;
  cashierName: string;
  academicYear: string;
  status: "Success";
}

export interface AcademicYear {
  id: string;
  name: string;
  active: boolean;
  closed?: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  receiptFooter: string;
  principal: string;
}
