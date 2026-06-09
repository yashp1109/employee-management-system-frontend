import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Employee, ManagerOption, Page } from "../core/models/models";

const API_URL = "http://localhost:8080/api/employees";

export interface EmployeeFilters {
  q?: string;
  departmentId?: number | null;
  managerId?: number | null;
  joiningFrom?: string | null;
  joiningTo?: string | null;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: "root" })
export class EmployeeService {
  constructor(private http: HttpClient) {}
  list(filters: EmployeeFilters = {}) {
    let params = new HttpParams()
      .set("page", filters.page ?? 0)
      .set("size", filters.size ?? 10)
      .set("sort", "employeeCode,asc");
    if (filters.q) params = params.set("q", filters.q);
    if (filters.departmentId != null)
      params = params.set("departmentId", filters.departmentId);
    if (filters.managerId != null)
      params = params.set("managerId", filters.managerId);
    if (filters.joiningFrom) params = params.set("joiningFrom", filters.joiningFrom);
    if (filters.joiningTo) params = params.set("joiningTo", filters.joiningTo);
    return this.http.get<Page<Employee>>(API_URL, { params });
  }
  managers() {
    return this.http.get<ManagerOption[]>(`${API_URL}/managers`);
  }
  get(id: number) {
    return this.http.get<Employee>(`${API_URL}/${id}`);
  }
  me() {
    return this.http.get<Employee>(`${API_URL}/me`);
  }
  create(employee: Employee) {
    return this.http.post<Employee>(API_URL, employee);
  }
  update(id: number, employee: Employee) {
    return this.http.put<Employee>(`${API_URL}/${id}`, employee);
  }
  delete(id: number) {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
