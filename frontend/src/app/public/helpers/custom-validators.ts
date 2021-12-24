import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value as string;
    const confirmPassword = control.get('confirmPassword')?.value as string;

    if (
      password !== null &&
      confirmPassword !== null &&
      password === confirmPassword
    ) {
      return null;
    }

    return {
      passwordsNotMatching: true,
    };
  }
}
