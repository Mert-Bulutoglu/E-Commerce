import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  returnUrl: string;

  constructor(private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log(user);
      switch (user.provider) {
        case "GOOGLE":
          this.handleGoogleService(user);
          break;
        case "FACEBOOK":
          this.handleFacebookService(user);
          break;
      }
    });
  }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators
        .pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new UntypedFormControl('', Validators.required)
    });
  }

  handleFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  handleGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  handleFacebookService(user: SocialUser) {
    this.accountService.facebookLogin(user).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error)
    });
  }

  handleGoogleService(user: SocialUser) {
    this.accountService.googleLogin(user).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error)
    });
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error);
    });
  }

}
