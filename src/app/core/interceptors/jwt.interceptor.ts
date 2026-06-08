import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { SnackbarService } from "src/app/services/snackbar.service";

// Endpoints that return 403 due to backend role config but should not redirect
const OWN_DATA_PATHS = [
  "/leaves/history",
  "/leaves/balance",
  "/employees/me",
  "/attendance",
];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token =
    localStorage.getItem("token") || localStorage.getItem("ems_access_token");
  const snackBar = inject(SnackbarService);

  // If token exists, check expiration before attaching it to requests.
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp <= now) {
          // Token expired: sign out and prevent request from going out with expired token
          localStorage.removeItem("token");
          localStorage.removeItem("ems_access_token");
          router.navigateByUrl("/login");
          return throwError(() => new Error("Token expired"));
        }
      }
    } catch (e) {
      // If we can't parse token, be conservative and sign out
      localStorage.removeItem("token");
      localStorage.removeItem("ems_access_token");
      router.navigateByUrl("/login");
      return throwError(() => new Error("Invalid token"));
    }
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("ems_access_token");
        router.navigateByUrl("/login");
      } else if (err.status === 403) {
        const isOwnDataCall = OWN_DATA_PATHS.some((p) => req.url.includes(p));
        if (!isOwnDataCall) {
          snackBar.errorSnackBar(
            "You do not have permission to perform this action.",
          );
          router.navigateByUrl("/dashboard");
        }
      }
      return throwError(() => err);
    }),
  );
};
