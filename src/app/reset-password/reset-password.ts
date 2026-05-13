import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {

  email = '';
  newPassword = '';
  confirmPassword = '';
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.email =
      this.route.snapshot.queryParams['email']
      || sessionStorage.getItem('resetEmail')
      || '';

    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  resetPassword() {

    // ❌ Password mismatch
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Passwords do not match',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          confirmButton: 'my-swal-button'
        }
      });
      return;
    }

    this.http.post<any>(
      `https://localhost:7107/api/Admin/ResetPassword?Email=${this.email}&Passwords=${this.newPassword}`,
      {}
    ).subscribe({

      next: (res) => {

        if (res.success) {

          Swal.fire({
            title: 'Success',
            text: 'Password Reset Done',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              popup: 'my-swal-popup',
              title: 'my-swal-title',
              confirmButton: 'my-swal-button'
            }
          });

          sessionStorage.removeItem('resetEmail');

          this.router.navigate(['/login']);

        } else {

          Swal.fire({
            title: 'Error',
            text: 'Reset failed',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'my-swal-popup',
              title: 'my-swal-title',
              confirmButton: 'my-swal-button'
            }
          });

        }
      },

      error: () => {

        Swal.fire({
          title: 'Error',
          text: 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            confirmButton: 'my-swal-button'
          }
        });

      }

    });
  }

  close() {
    this.router.navigate(['/home']);
  }
}
