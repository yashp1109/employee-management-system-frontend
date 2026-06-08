import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Attendance, Employee } from "../../core/models/models";
import { AttendanceService } from "../../services/attendance.service";
import { EmployeeService } from "../../services/employee.service";
import { MatSnackBar } from "@angular/material/snack-bar";
const WORK_DAY_MINUTES = 9 * 60;
const RING_CIRCUMFERENCE = 2 * Math.PI * 32;
const SHOW_DAYS = 14; // how many past days to show including today

export interface AttendanceRow {
  id?: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
  message?: string;
  status: "present" | "live" | "incomplete" | "yet-to-checkin" | "absent";
}

@Component({
  selector: "attendance-list",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: "./attendance-list.component.html",
  styleUrl: "./attendance-list.component.css",
})
export class AttendanceListComponent implements OnInit, OnDestroy {
  @Input() employeeId?: number;
  rows: AttendanceRow[] = [];
  displayRows: AttendanceRow[] = [];
  now = new Date();
  pageIndex = 0;
  pageSize = 7;
  pageSizeOptions = [5, 7, 14];
  private ticker?: ReturnType<typeof setInterval>;

  constructor(
    private attendance: AttendanceService,
    private employees: EmployeeService,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    this.loadJoinDate();

    this.ticker = setInterval(() => {
      this.now = new Date();
      this.buildRows(this._raw);
    }, 60_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.ticker);
  }

  private _raw: Attendance[] = [];
  private joinDate?: string;

  loadJoinDate(): void {
    if (this.employeeId != null) {
      this.employees.get(this.employeeId).subscribe((employee) => {
        this.joinDate = employee.dateOfJoining;
        this.load();
      });
    } else {
      this.employees.me().subscribe((employee) => {
        this.joinDate = employee.dateOfJoining;
        this.load();
      });
    }
  }

  load(): void {
    this.attendance.history(this.employeeId).subscribe((page) => {
      this._raw = page.content;
      console.debug(
        "attendance.load: fetched",
        this._raw.map((a) => ({
          date: a.date,
          checkIn: a.checkInTime,
          checkOut: a.checkOutTime,
        })),
      );
      this.buildRows(this._raw);
      this.updateDisplayRows();
    });
  }

  private buildRows(raw: Attendance[]): void {
    const today = this.dateStr(new Date());
    const joinStartDate = this.joinDate ? this.parseYMD(this.joinDate) : null;
    const recordMap = new Map(
      raw.map((a) => [this.normalizeDateString(a.date), a]),
    );
    const result: AttendanceRow[] = [];

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - SHOW_DAYS + 1);
    const effectiveStart = joinStartDate
      ? new Date(Math.max(startDate.getTime(), joinStartDate.getTime()))
      : startDate;

    for (let d = new Date(); d >= effectiveStart; d.setDate(d.getDate() - 1)) {
      const dateKey = this.dateStr(d);
      const rec = recordMap.get(dateKey);

      if (rec) {
        const live = dateKey === today && !rec.checkOutTime;
        result.push({
          id: rec.id,
          date: dateKey,
          checkInTime: rec.checkInTime,
          checkOutTime: rec.checkOutTime,
          workingHours: rec.workingHours,
          message: rec.message,
          status: live ? "live" : rec.checkOutTime ? "present" : "incomplete",
        });
      } else {
        result.push({
          date: dateKey,
          status: dateKey === today ? "yet-to-checkin" : "absent",
        });
      }
    }
    // dates are stored as 'YYYY-MM-DD' so string compare works for sorting
    this.rows = result.sort((a, b) => b.date.localeCompare(a.date));
    this.updateDisplayRows();
  }

  // Parse a 'YYYY-MM-DD' string into a local Date at midnight to avoid
  // timezone shifts when constructing Date from ISO strings.
  private parseYMD(v: string): Date {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Date(v);
  }

  // Normalize a date value received from the server to a 'YYYY-MM-DD' string
  // Handles values like '2026-06-07', '2026-06-07T12:34:56Z' and Date objects.
  private normalizeDateString(v: string | Date | undefined): string {
    if (!v) return "";
    if (v instanceof Date) return this.dateStr(v);
    // if string starts with YYYY-MM-DD, take that part to avoid timezone shifts
    const m = v.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    return this.dateStr(new Date(v));
  }

  private dateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  checkIn(): void {
    this.attendance.checkIn().subscribe({
      next: (resp) => {
        console.debug("attendance.checkIn: resp", resp);
        this.snackBar.open(resp.message, "Close", {
          duration: 3000,
        });
        // optimistic update: merge returned attendance into local cache
        try {
          const key = this.normalizeDateString(resp.date);
          console.debug("attendance.checkIn: normalized key", key);
          const idx = this._raw.findIndex(
            (a) => this.normalizeDateString(a.date) === key,
          );
          if (idx >= 0) this._raw[idx] = resp;
          else this._raw.push(resp);
          this.pageIndex = 0;
          this.buildRows(this._raw);
          this.updateDisplayRows();
        } catch (e) {
          // fallback to full reload if anything goes wrong
          this.pageIndex = 0;
          this.load();
        }
      },
    });
  }

  checkOut(): void {
    this.attendance.checkOut().subscribe({
      next: (resp) => {
        console.debug("attendance.checkOut: resp", resp);
        this.snackBar.open(resp.message, "Close", {
          duration: 3000,
        });
        // optimistic update: merge returned attendance into local cache
        try {
          const key = this.normalizeDateString(resp.date);
          console.debug("attendance.checkOut: normalized key", key);
          const idx = this._raw.findIndex(
            (a) => this.normalizeDateString(a.date) === key,
          );
          if (idx >= 0) this._raw[idx] = resp;
          else this._raw.push(resp);
          this.pageIndex = 0;
          this.buildRows(this._raw);
          this.updateDisplayRows();
          this.load();
        } catch (e) {
          this.pageIndex = 0;
          this.load();
        }
      },
    });
  }

  private toMinutes(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  barWidth(a: AttendanceRow): number {
    if (!a.checkInTime) return 0;
    const start = this.toMinutes(a.checkInTime);
    const end = a.checkOutTime
      ? this.toMinutes(a.checkOutTime)
      : this.now.getHours() * 60 + this.now.getMinutes();
    return Math.min(100, (Math.max(0, end - start) / WORK_DAY_MINUTES) * 100);
  }

  ringOffset(a: AttendanceRow): number {
    return RING_CIRCUMFERENCE * (1 - this.barWidth(a) / 100);
  }

  formatTime(t: string | undefined): string {
    if (!t) return "--:--";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  hoursLabel(a: AttendanceRow): string {
    if (a.workingHours != null) {
      const h = Math.floor(a.workingHours);
      const m = Math.round((a.workingHours - h) * 60);
      return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
    }
    if (!a.checkInTime) return "--";
    const start = this.toMinutes(a.checkInTime);
    const end = this.now.getHours() * 60 + this.now.getMinutes();
    const mins = Math.max(0, end - start);
    const h = Math.floor(mins / 60),
      m = mins % 60;
    return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
  }

  get presentCount(): number {
    return this.rows.filter(
      (r) => r.status === "present" || r.status === "live",
    ).length;
  }

  get pageCount(): number {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  updateDisplayRows(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayRows = this.rows.slice(start, end);
    console.log(this.displayRows);
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayRows();
  }
  get absentCount(): number {
    return this.rows.filter((r) => r.status === "absent").length;
  }
  get liveRecord(): AttendanceRow | undefined {
    return this.rows.find((r) => r.status === "live");
  }
}
