import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthResponse, Role } from "../models/models";
import { SnackbarService } from "src/app/services/snackbar.service";

const API_URL = "http://localhost:8080/api";

function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly currentUser = signal<AuthResponse | null>(this.readUserFromToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private sanckBar: SnackbarService,
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap((response) => this.setSession(response)));
  }

  refresh(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      })
      .pipe(tap((response) => this.setSession(response)));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${API_URL}/auth/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("ems_refresh_token");
    this.currentUser.set(null);
    this.sanckBar.wanrningSnackBar("You have been logged out.");
    this.router.navigateByUrl("/login");
  }

  hasRole(roles: Role[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }

  canManageAll(): boolean {
    return this.hasRole(["ADMIN", "HR"]);
  }

  canViewEmployee(empId?: number): boolean {
    const user = this.currentUser();
    if (!user) return false;
    if (this.canManageAll()) return true;
    return empId === user.employeeId;
  }

  canEditEmployee(empId?: number): boolean {
    return this.canManageAll();
  }

  canRequestProfileUpdate(empId?: number): boolean {
    const user = this.currentUser();
    if (!user) return false;
    // employees can request update for their own profile when they don't have edit rights
    return empId === user.employeeId && !this.canEditEmployee(empId);
  }

  get role(): Role | null {
    return this.currentUser()?.role ?? null;
  }

  get email(): string | null {
    const token = this.accessToken;
    if (!token) return null;
    return decodeJwt(token)?.["sub"] ?? null;
  }

  get accessToken(): string | null {
    return (
      localStorage.getItem("token") || localStorage.getItem("ems_access_token")
    );
  }

  get refreshToken(): string | null {
    return localStorage.getItem("ems_refresh_token");
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("ems_refresh_token", response.refreshToken);
    // Prefer JWT claims as the source of truth for role
    const claims = decodeJwt(response.accessToken);
    const role: Role = (claims?.["role"] ?? response.role) as Role;
    const departmentId = claims?.["departmentId"] ?? response.departmentId;
    this.currentUser.set({ ...response, role, departmentId });
  }

  private readUserFromToken(): AuthResponse | null {
    const token =
      localStorage.getItem("token") || localStorage.getItem("ems_access_token");
    if (!token) return null;
    const claims = decodeJwt(token);
    if (!claims) return null;
    return {
      accessToken: token,
      refreshToken: localStorage.getItem("ems_refresh_token") ?? "",
      employeeId: claims["employeeId"] ?? 0,
      fullName: claims["fullName"] ?? claims["sub"] ?? "",
      role: claims["role"] as Role,
      departmentId: claims["departmentId"] ?? undefined,
    };
  }
}
