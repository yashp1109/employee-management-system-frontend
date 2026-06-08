import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API_URL = "http://localhost:8080/api/requests";

@Injectable({ providedIn: "root" })
export class RequestService {
  constructor(private http: HttpClient) {}

  submitProfileUpdateRequest(employeeId: number, comment: string) {
    const payload = {
      employeeId,
      comment,
      type: "PROFILE_UPDATE",
      status: "PENDING",
    };
    return this.http.post(`${API_URL}/profile-update`, payload);
  }

  submitLeaveRequest(employeeId: number, payload: any) {
    return this.http.post(`${API_URL}/leave`, { employeeId, ...payload });
  }
}
