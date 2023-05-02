import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IUsers } from '../shared/models/users';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ConfirmationDialog } from '../shared/models/confirmation-dialog';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements AfterViewInit {

  users: IUsers[] = []
  dataSource: MatTableDataSource<IUsers>;
  displayedColumns: string[] = ['displayName','email', 'roleName', 'address','action'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedUser: IUsers | null
  showUserModal: boolean = false;
  selectedUser: IUsers;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService
  ) { 
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
        console.log(this.users);
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) =>{
        console.log(err);
        this.toastrService.error(`Error occurred while retrieving data`);
      },
      complete: () => {
        console.log("get user completed.");
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDeleteConfirmation(id: number | string) {
    const selectedUser: IUsers = this.users.find(u => u.id === id);
    const data: ConfirmationDialog = {
      message: `Are you sure you want to remove the user '${selectedUser.displayName}'`,
      data: selectedUser
    }
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) this.deleteUser(selectedUser.id);
    });
  }

  showUserDetails(id: number | string): void {
    this.router.navigate(['/user', id]) ;
  }

  deleteUser(id: number | string) {
    this.userService.deleteUser(id)
      .subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === id);
          if (index > -1) {
            this.users.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.toastrService.success('User deleted successfully.')
          }
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error('Error deleting user.');
        },
        complete: () => {
          console.log('User deletion completed.');
        } 
      });
  }

}
