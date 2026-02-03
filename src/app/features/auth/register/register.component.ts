import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '@core/services/auth.service';
import { RegisterData, UserRole } from '@shared/models';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;

  readonly roles: UserRole[] = ['developer', 'project-manager', 'viewer'];

  readonly registerForm = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      role: new FormControl<UserRole>('developer', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.getRawValue();
      this.authService.register(registerData as RegisterData).subscribe({
        error: (error) => {
          console.error('Registration failed:', error);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((hide) => !hide);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((hide) => !hide);
  }

  getEmailErrorMessage(): string {
    const emailControl = this.registerForm.controls.email;
    if (emailControl.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.controls.password;
    if (passwordControl.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const confirmControl = this.registerForm.controls.confirmPassword;
    if (confirmControl.hasError('required')) {
      return 'Please confirm your password';
    }
    if (this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getFirstNameErrorMessage(): string {
    const firstNameControl = this.registerForm.controls.firstName;
    if (firstNameControl.hasError('required')) {
      return 'First name is required';
    }
    if (firstNameControl.hasError('minlength')) {
      return 'First name must be at least 2 characters';
    }
    return '';
  }

  getLastNameErrorMessage(): string {
    const lastNameControl = this.registerForm.controls.lastName;
    if (lastNameControl.hasError('required')) {
      return 'Last name is required';
    }
    if (lastNameControl.hasError('minlength')) {
      return 'Last name must be at least 2 characters';
    }
    return '';
  }
}
