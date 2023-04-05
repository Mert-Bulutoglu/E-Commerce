import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TypeService } from './type.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IType } from '../shared/models/productType';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialog } from '../shared/models/confirmation-dialog';
import { ApiResponse } from '../shared/models/api-response';
@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})

export class TypeComponent implements AfterViewInit {
  types: IType[] = [];
  dataSource: MatTableDataSource<IType>;
  displayedColumns: string[] = ['typeName', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: any;

  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private typeService: TypeService,
  ) {
    this.dataSource = new MatTableDataSource(this.types);
  }


  

  ngOnInit(): void {
    this.types = this.typeService.getAllTypes().subscribe({
      next: (data: any) => {
        this.types = data;
        console.log(this.types);
        this.dataSource = new MatTableDataSource(this.types);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) =>{
        console.log(err);
      },
      complete: () => {
        console.log("get type completed.");
      }
    });

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    }, { updateOn: 'submit'});
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDeleteConfirmation(id: number | string) {
    const selectedType: IType = this.types.find(u => u.id === id);
    const data: ConfirmationDialog = {
      message: `Are you sure you want to remove the type '${selectedType.name}'`,
      data: selectedType
    }
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) this.deleteType(selectedType.id);
    });
  }

  deleteType(id: number | string) {
    this.typeService.deleteType(id)
      .subscribe({
        next: () => {
          const index = this.types.findIndex(u => u.id === id);
          if (index > -1) {
            this.types.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.types);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('Type deletion completed.');
        } 
      });
  }

  saveType(form: FormGroup){
    if(form.valid){
      let type: IType = form.value;
      console.log(type);
      this.typeService.createType(type)
      .subscribe({
        next: (data: any) => {
          console.log(data);

          this.types.push(data);
          this.dataSource = new MatTableDataSource(this.types);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('type add completed');
        } 
      })
    }
  }

  get name(): any {
    return this.form.get('name');
  }
  
}
