import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API_URL = "http://localhost:8080/api/dashboard";

@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(private http: HttpClient) {}
  admin() {
    return this.http.get<any>(`${API_URL}/admin`);
  }
  manager() {
    return this.http.get<any>(`${API_URL}/manager`);
  }
  employee() {
    return this.http.get<any>(`${API_URL}/employee`);
  }
}
