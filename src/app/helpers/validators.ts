import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors['passwordMismatch']
    ) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}

export function passwordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  const errors: any = {};

  if (value.length < 8) {
    errors.minLength = 'Password must be at least 8 characters long';
  }
  if (!/[a-z]/.test(value)) {
    errors.lowercase = 'Password must contain at least one lowercase letter';
  }
  if (!/[A-Z]/.test(value)) {
    errors.uppercase = 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(value)) {
    errors.number = 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*]/.test(value)) {
    errors.symbol = 'Password must contain at least one special character';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
