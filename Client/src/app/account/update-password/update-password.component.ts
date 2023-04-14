import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  returnUrl: string;
  loginForm: UntypedFormGroup;
  showPassword: boolean = false;
  showPasswordSecond: boolean = false;
  
  constructor(spinner: NgxSpinnerService, private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
    ) { }

  state: boolean;

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/account/login';
    this.createPasswordResetForm();
    
    this.activatedRoute.params.subscribe({
      next: params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        this.accountService.verifyResetToken(resetToken, userId).subscribe(() => {
          this.state = true;
        }, error => {
          console.log(error)
        });
      }
    });
  }


  onSubmit(){
    const password = this.loginForm.get('password').value;
    const passwordConfirm = this.loginForm.get('passwordConfirm').value;
    let userId: string;
    let resetToken: string;
    this.activatedRoute.params.subscribe({
      next: params => {
        userId = params['userId'];
        resetToken = params['resetToken'];
      }
    });
    this.accountService.updatePassword(userId, resetToken, password, passwordConfirm).subscribe(() => {
      this.toastrService.success("Password updated successfully.")
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error);
    });

  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilitySecond(): void {
    this.showPasswordSecond = !this.showPasswordSecond;
  }

  createPasswordResetForm() {
    this.loginForm = new UntypedFormGroup({
         email: new UntypedFormControl('', [Validators.required, Validators
        .pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
        password: new UntypedFormControl('', Validators.required),
        passwordConfirm: new UntypedFormControl('', Validators.required)
    });
  }

  updatePassword() {
    
  }

}
