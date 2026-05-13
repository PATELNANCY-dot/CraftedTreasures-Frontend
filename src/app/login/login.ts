import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../Service/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';
  hidePassword = true;

  otpSent: boolean = false;
  step: number = 1;

  resetEmail: string = '';
  otp: string = '';
  newPassword: string = '';


  isLoading: boolean = false;
  isResendingOtp: boolean = false;
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) { }

  // ================= LOGIN =================
  loginUser() {

    this.http.get<any>(
      `https://localhost:7107/api/Treasure/LoginClient?Email=${encodeURIComponent(this.email)}&passwords=${encodeURIComponent(this.password)}`
    ).subscribe({
      next: (data) => {

        if (data.success) {

          this.userService.setUser({
            ClientID: data.clientID,
            fullName: data.fullName,
            email: data.email,
            isLoggedIn: true
          });

          this.showAlert('success', 'Login Successful', 'Welcome back!');
          this.router.navigate(['/home']);

        } else {

          this.showAlert('error', 'Login Failed', 'Invalid email or password');

        }
      },

      error: () => {

        this.showStyledAlert(
          'error',
          'Server Error',
          'Something went wrong'
        );

      }
    });
  }

  // ================= OTP SEND =================
  sendOtp() {

    if (!this.resetEmail) {
      this.showStyledAlert('error', 'Error', 'Please enter email');
      return;
    }

    this.isLoading = true; //  START LOADER

    this.http.post<any>(
      `https://localhost:7107/api/Admin/SendOTP?Email=${this.resetEmail}`,
      {}
    ).subscribe({
      next: (res) => {

        this.isLoading = false; // STOP LOADER

        if (res.success) {
          this.showStyledAlert('success', 'OTP Sent', 'Check your email inbox');
          this.step = 2;
        } else {
          this.showStyledAlert('error', 'Error', res.message || 'Email not found');
        }

      },
      error: () => {
        this.isLoading = false; // STOP LOADER
        this.showStyledAlert('error', 'Error', 'Server error');
      }
    });
  }

  // ================= OTP VERIFY =================
  verifyOtp() {

    const cleanOtp = this.otp.trim();

    this.http.post<any>(
      `https://localhost:7107/api/Admin/VerifyOTP?Email=${this.resetEmail}&OTP=${cleanOtp}`,
      {}
    ).subscribe({
      next: (res) => {

        if (res.success) {

          this.showStyledAlert('success', 'OTP Verified', 'Redirecting...');

          // Close modal
          const modalElement = document.getElementById('forgotModal');
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();

          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          document.body.classList.remove('modal-open');

          sessionStorage.setItem('resetEmail', this.resetEmail);

          this.router.navigate(['/reset-password']);

          this.otpSent = false;
          this.resetEmail = '';
          this.otp = '';

        } else {
          this.showStyledAlert('error', 'Invalid OTP', 'Try again');
        }

      },
      error: () => {
        this.showStyledAlert('error', 'Error', 'Server error');
      }
    });
  }

  // ================= CUSTOM SWEETALERT =================
  showStyledAlert(icon: string, title: string, text: string) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: 'OK',
      customClass: {
        popup: 'my-swal-popup',
        title: 'my-swal-title',
        confirmButton: 'my-swal-button'
      }
    });
  }

  // alias (optional backward compatibility)
  showAlert(icon: string, title: string, text: string) {
    this.showStyledAlert(icon, title, text);
  }

  close() {
    this.router.navigate(['/home']);
  }



  resendOtp() {

    if (!this.resetEmail) {
      this.showStyledAlert('error', 'Error', 'Email missing');
      return;
    }

    this.isResendingOtp = true;

    this.http.post<any>(
      `https://localhost:7107/api/Admin/SendOTP?Email=${this.resetEmail}`,
      {}
    ).subscribe({
      next: (res) => {

        this.isResendingOtp = false;

        if (res.success) {
          this.showStyledAlert('success', 'OTP Resent', 'Check your email again');
          this.step = 2;
        } else {
          this.showStyledAlert('error', 'Error', res.message || 'Failed to resend OTP');
        }

      },
      error: () => {
        this.isResendingOtp = false;
        this.showStyledAlert('error', 'Error', 'Server error');
      }
    });
  }
}
