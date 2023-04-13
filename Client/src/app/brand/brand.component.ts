import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BrandService } from './brand.service';
import { ConfirmationDialog } from '../shared/models/confirmation-dialog';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})

export class BrandComponent implements AfterViewInit {
  brands: IBrand[] = [];
  dataSource: MatTableDataSource<IBrand>;
  displayedColumns: string[] = ['brandName', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  form: any;

  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private fb: UntypedFormBuilder,
    private brandService: BrandService,
    private toastrService: ToastrService
  ) {
    this.dataSource = new MatTableDataSource(this.brands);
  }


  

  ngOnInit(): void {
    this.brands = this.brandService.getAllBrands().subscribe({
      next: (data: any) => {
        this.brands = data;
        console.log(this.brands);
        this.dataSource = new MatTableDataSource(this.brands);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) =>{
        console.log(err);
      },
      complete: () => {
        console.log("get brand completed.");
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
    const selectedBrand: IBrand = this.brands.find(u => u.id === id);
    const data: ConfirmationDialog = {
      message: `Are you sure you want to remove the brand '${selectedBrand.name}'`,
      data: selectedBrand
    }
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) this.deleteBrand(selectedBrand.id);
    });
  }

  deleteBrand(id: number | string) {
    this.brandService.deleteBrand(id)
      .subscribe({
        next: () => {
          const index = this.brands.findIndex(u => u.id === id);
          if (index > -1) {
            this.brands.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.brands);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.toastrService.success('Brand deleted successfully.')
          }
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error(`Error deleting brand.`);
        },
        complete: () => {
          console.log('Brand deletion completed.');
        } 
      });
  }

  saveBrand(form: UntypedFormGroup){
    if(form.valid){
      let brand: IBrand = form.value;
      console.log(brand);
      this.brandService.createBrand(brand)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.brands.push(data);
          this.dataSource = new MatTableDataSource(this.brands);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.toastrService.success(`Brand "${data.name}" added successfully.`);
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error(`Error deleting brand.`);
        },
        complete: () => {
          console.log('brand add completed');
        } 
      })
    }
  }

  get name(): any {
    return this.form.get('name');
  }
  
}

