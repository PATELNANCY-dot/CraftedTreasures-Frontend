import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword {

  clientId: number = 0;

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  isLoading = false;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const stored = sessionStorage.getItem('user');

    if (stored) {
      const user = JSON.parse(stored);
      this.clientId = user.ClientID;
    }

    if (!this.clientId) {
      this.router.navigate(['/login']);
    }
  }

  changePassword() {

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      Swal.fire('Missing', 'Please fill all fields', 'warning');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    this.isLoading = true;

    this.http.post<any>(
      `https://localhost:7107/api/Treasure/ChangePassword?ClientID=${this.clientId}&OldPassword=${this.oldPassword}&NewPassword=${this.newPassword}`,
      {}
    ).subscribe({
      next: (res) => {

        this.isLoading = false;

        if (res?.message?.includes('Successfully')) {
          Swal.fire('Success', res.message, 'success');
          this.router.navigate(['/home']);
        } else {
          Swal.fire('Error', res.message || 'Failed', 'error');
        }

      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Server error', 'error');
      }
    });
  }
}
