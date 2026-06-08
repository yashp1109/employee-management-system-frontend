import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  templateUrl: './dashboard-redirect.component.html',
  styleUrl: './dashboard-redirect.component.css'
})
export class DashboardRedirectComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const target = this.auth.hasRole(['ADMIN']) ? '/dashboard/admin' : this.auth.hasRole(['MANAGER', 'HR']) ? '/dashboard/manager' : '/dashboard/employee';
    this.router.navigateByUrl(target);
  }
}
