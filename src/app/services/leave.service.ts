import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LeaveBalance, LeaveRequest, Page } from "../core/models/models";

const API_URL = "http://localhost:8080/api/leaves";

@Injectable({ providedIn: "root" })
export class LeaveService {
  constructor(private http: HttpClient) {}
  apply(request: LeaveRequest) {
    return this.http.post<LeaveRequest>(API_URL, request);
  }
  history() {
    return this.http.get<Page<LeaveRequest>>(`${API_URL}/history`);
  }
  balance() {
    return this.http.get<LeaveBalance[]>(`${API_URL}/balance`);
  }
  pending() {
    return this.http.get<Page<LeaveRequest>>(`${API_URL}/pending-approvals`);
  }
  approve(id: number) {
    return this.http.patch<LeaveRequest>(`${API_URL}/${id}/approve`, {});
  }
  reject(id: number) {
    return this.http.patch<LeaveRequest>(`${API_URL}/${id}/reject`, {});
  }
  cancel(id: number) {
    return this.http.patch<LeaveRequest>(`${API_URL}/${id}/cancel`, {});
  }
}
