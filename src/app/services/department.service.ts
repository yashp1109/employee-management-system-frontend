import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Department, Designation } from "../core/models/models";

const API_URL = "http://localhost:8080/api/departments";
const DESIG_URL = "http://localhost:8080/api/designations";

@Injectable({ providedIn: "root" })
export class DepartmentService {
  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Department[]>(API_URL);
  }

  designations(departmentId: number) {
    return this.http.get<Designation[]>(
      `${DESIG_URL}?departmentId=${departmentId}`,
    );
  }
  create(department: Department) {
    return this.http.post<Department>(API_URL, department);
  }
  update(id: number, department: Department) {
    return this.http.put<Department>(`${API_URL}/${id}`, department);
  }
  delete(id: number) {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
