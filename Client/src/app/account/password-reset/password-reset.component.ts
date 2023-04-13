import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  returnUrl: string;
  loginForm: UntypedFormGroup;

  constructor(spinner: NgxSpinnerService, private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
    ) { }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/account/login';
    this.createPasswordResetForm();
  }

  createPasswordResetForm() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators
        .pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')])
    });
  }

  onSubmit() {
    this.accountService.passwordReset(this.loginForm.value).subscribe(() => {
      this.toastrService.success("Password reset mail has been send, please check your email.")
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error);
    });
  }

}
