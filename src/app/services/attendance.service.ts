import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Attendance, Page } from "../core/models/models";

const API_URL = "http://localhost:8080/api/attendance";

@Injectable({ providedIn: "root" })
export class AttendanceService {
  constructor(private http: HttpClient) {}
  checkIn() {
    return this.http.post<Attendance>(`${API_URL}/check-in`, {});
  }
  checkOut() {
    return this.http.post<Attendance>(`${API_URL}/check-out`, {});
  }
  history(employeeId?: number) {
    const params: any = {};
    if (employeeId != null) params.employeeId = employeeId;
    return this.http.get<Page<Attendance>>(API_URL, { params });
  }
}
