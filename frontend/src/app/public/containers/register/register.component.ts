import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CustomValidators } from '../../helpers/custom-validators';
import { MyErrorStateMatcher } from '../../helpers/form-error-state-matcher';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    },
    {
      validators: CustomValidators.passwordsMatching,
    }
  );

  matcher = new MyErrorStateMatcher();

  constructor(private userService: UserService, private router: Router) {}

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  register() {
    if (!this.form.valid) {
      return;
    }

    this.userService
      .create({
        email: this.email.value,
        password: this.password.value,
        username: this.username.value,
      })
      .pipe(tap(() => this.router.navigate(['../login'])))
      .subscribe();
  }
}
