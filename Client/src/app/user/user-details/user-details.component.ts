import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsers } from 'src/app/shared/models/users';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { IRole } from 'src/app/shared/models/role';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  form: UntypedFormGroup;
  user: IUsers;
  rolesList: IRole[] = [];
  hidePassword: boolean = false;
  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private http: HttpClient,
    private toastrService: ToastrService

  ) { }



  ngOnInit() {
    const userId: string = this.route.snapshot.paramMap.get('id');

    this.getAllRoles();

    if (userId) {
      this.getUser(userId);
      this.hidePassword = false;
      this.form = this.fb.group({
        displayName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        roleName: ['', [Validators.required]],
      });
    }
    else {
      this.hidePassword = true;
      this.form = this.fb.group({
        displayName: ['', [Validators.required]],
        email: ['', [Validators.required]],
        roleName: ['', [Validators.required]]
      });
    }
  }

  getUser(userId: string) {
    this.userService.getUser(userId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.user = data;
          this.prefillForm();
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error(`Error occurred while retrieving data`);
        },
        complete: () => {
          console.log('get by id completed');
        }
      });
  }

  getAllRoles() {
    this.userService.getUserRoles()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.rolesList = data;
          if (this.user) {
            this.prefillForm();
          }
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error(`Error occurred while retrieving data`);
        },
        complete: () => {
          console.log('get brand completed');
        }
      });
  }

  updateUser(id: number, form: UntypedFormGroup) {
    if (form.valid) {
      const user: IUsers = form.value;
      user.id = id;
      console.log(user);
      this.userService.updateUser(id, user)
        .subscribe({
          next: (data: any) => {
            this.toastrService.success(`Update user "${user.displayName}" successfully.`)
            console.log(data);
          },
          error: (err: any) => {
            console.log(err);
            this.toastrService.error('Error updating user.');
          },
          complete: () => {
            console.log('user update completed');
          }
        })
    }
  }

  saveUser(form: UntypedFormGroup) {
    if (form.valid) {
      let user: IUsers = form.value;
      this.userService.createUser(user)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/user']);
          },
          error: (err: any) => {
            console.log(err);
            this.toastrService.error(`Error occurred while retrieving data`);
          },
          complete: () => {
            console.log('user add completed');
          }
        })
    }
  }

  handleSaveButton(form: UntypedFormGroup) {
    console.log(form.value);
    if (this.user) {
      this.updateUser(this.user.id, form);
    } else {
      this.saveUser(form);
    }
  }



  prefillForm(): void {
    this.displayName.setValue(this.user.displayName);
    this.email.setValue(this.user.email);
    this.roleName.setValue(this.user.roleName);
  }

  get displayName(): any {
    return this.form.get('displayName');
  }
  get email(): any {
    return this.form.get('email');
  }

  get roleName(): any {
    return this.form.get('roleName');
  }

}
