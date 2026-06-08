import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../../core/models/models';

@Pipe({ name: 'employeeName', standalone: true })
export class EmployeeNamePipe implements PipeTransform {
  transform(employee: Employee | null | undefined): string {
    if (!employee) {
      return '';
    }
    return `${employee.firstName} ${employee.lastName}`.trim();
  }
}
