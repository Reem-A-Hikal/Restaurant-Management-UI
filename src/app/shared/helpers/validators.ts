import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: 'Passwords do not match' };
    }

    return null;
  };
}

export function passwordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value || '';
  const errors: Record<string, string> = {};

  if (value.length < 8)
    errors['minLength'] = 'Password must be at least 8 characters long';

  if (!/[a-z]/.test(value))
    errors['lowercase'] = 'At least one lowercase letter';

  if (!/[A-Z]/.test(value))
    errors['uppercase'] = 'At least one uppercase letter';

  if (!/\d/.test(value)) errors['number'] = 'At least one number required';

  if (!/[!@#$%^&*]/.test(value))
    errors['symbol'] = 'At least one special character required';

  return Object.keys(errors).length ? errors : null;
}

export function fullNameValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = (control.value || '').trim();
  if (!value) return null;

  const words = value.split(/\s+/).filter((w: string) => w.length > 0);
if (value.length < 6) {
    return { fullName: 'Full name must be at least 6 characters long' };
}

  if (words.length < 2) {
    return { fullName: 'Please enter first and last name' };
  }

  if (!/^[\p{L}\s]+$/u.test(value)) {
    return { fullName: 'Name should contain only letters' };
  }

  return null;
}
