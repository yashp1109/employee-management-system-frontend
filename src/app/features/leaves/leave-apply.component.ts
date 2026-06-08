import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { LeaveBalance } from "../../core/models/models";
import { LeaveService } from "src/app/services/leave.service";

const FALLBACK_TYPES: LeaveBalance[] = [
  {
    leaveTypeId: 1,
    leaveTypeName: "Casual Leave",
    totalDays: 0,
    usedDays: 0,
    remainingDays: -1,
  },
  {
    leaveTypeId: 2,
    leaveTypeName: "Sick Leave",
    totalDays: 0,
    usedDays: 0,
    remainingDays: -1,
  },
  {
    leaveTypeId: 3,
    leaveTypeName: "Earned Leave",
    totalDays: 0,
    usedDays: 0,
    remainingDays: -1,
  },
];

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: "./leave-apply.component.html",
  styleUrl: "./leave-apply.component.css",
})
export class LeaveApplyComponent implements OnInit {
  form = this.fb.group({
    leaveTypeId: [null as number | null, Validators.required],
    startDate: ["", Validators.required],
    endDate: ["", Validators.required],
    reason: ["", Validators.required],
  });

  balances: LeaveBalance[] = [];
  selectedBalance: LeaveBalance | null = null;
  balanceLoaded = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private leaves: LeaveService,
  ) {}

  ngOnInit(): void {
    this.leaves.balance().subscribe({
      next: (b: any) => {
        this.balances = b?.length ? b : FALLBACK_TYPES;
        this.balanceLoaded = true;
        this.syncSelected();
      },
      error: () => {
        this.balances = FALLBACK_TYPES;
        this.balanceLoaded = true;
      },
    });

    this.form
      .get("leaveTypeId")!
      .valueChanges.subscribe(() => this.syncSelected());
  }

  private syncSelected(): void {
    const id = this.form.get("leaveTypeId")!.value;
    this.selectedBalance = id
      ? (this.balances.find((b) => b.leaveTypeId === id) ?? null)
      : null;
  }

  get noLeaveLeft(): boolean {
    return (
      this.selectedBalance !== null &&
      this.selectedBalance.remainingDays !== -1 &&
      this.selectedBalance.remainingDays === 0
    );
  }

  get balanceKnown(): boolean {
    return (
      this.selectedBalance !== null && this.selectedBalance.remainingDays !== -1
    );
  }

  save(): void {
    if (this.form.invalid) return;
    this.leaves
      .apply(this.form.getRawValue() as any)
      .subscribe(() => this.router.navigateByUrl("/leaves"));
  }
}
