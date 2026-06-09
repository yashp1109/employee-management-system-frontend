export type Role = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
export type Status = "ACTIVE" | "INACTIVE" | "TERMINATED";

export interface PageMeta {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  page: PageMeta;
}

export interface ManagerOption {
  id: number;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  employeeId: number;
  fullName: string;
  role: Role;
  departmentId?: number;
}

export interface Employee {
  id?: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  dateOfJoining: string;
  departmentId: number;
  departmentName?: string;
  designationId: number;
  designationName?: string;
  salary: number;
  managerId?: number;
  managerName?: string;
  status: Status;
  role: Role;
  password?: string;
}

export interface Department {
  id?: number;
  name: string;
  description?: string;
}

export interface Designation {
  id?: number;
  name: string;
  description?: string;
  departmentId?: number;
  departmentName?: string;
}

export interface LeaveBalance {
  leaveTypeId: number;
  leaveTypeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  leaveTypeId: number;
  leaveTypeName?: string;
  startDate: string;
  endDate: string;
  days?: number;
  reason: string;
  status?: string;
}

export interface Attendance {
  id: number;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  workingHours?: number;
  message: string;
}
