import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Employee, Page } from "../core/models/models";

const API_URL = "http://localhost:8080/api/employees";

@Injectable({ providedIn: "root" })
export class EmployeeService {
  constructor(private http: HttpClient) {}
  list(q = "", page = 0, size = 10) {
    const params = new HttpParams()
      .set("q", q)
      .set("page", page)
      .set("size", size)
      .set("sort", "employeeCode,asc");
    return this.http.get<Page<Employee>>(API_URL, { params });
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
