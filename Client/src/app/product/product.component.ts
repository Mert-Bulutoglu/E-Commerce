import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialog } from '../shared/models/confirmation-dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterViewInit {

  products: IProduct[] = []
  dataSource: MatTableDataSource<IProduct>;
  displayedColumns: string[] = ['name', 'price','stock', 'productType', 'productBrand','action'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedProduct: IProduct | null
  showProductModal: boolean = false;
  selectedProduct: IProduct;
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private productService: ProductService,
    private toastrService: ToastrService
  ) { 
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        console.log(this.products);
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) =>{
        console.log(err);
      },
      complete: () => {
        console.log("get product completed.");
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
    const selectedProduct: IProduct = this.products.find(u => u.id === id);
    const data: ConfirmationDialog = {
      message: `Are you sure you want to remove the product '${selectedProduct.name}'`,
      data: selectedProduct
    }
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) this.deleteProduct(selectedProduct.id);
    });
  }

  showProductDetails(id: number | string): void {
    this.router.navigate(['/product', id]) ;
  }

  deleteProduct(id: number | string) {
    this.productService.deleteProduct(id)
      .subscribe({
        next: () => {
          const index = this.products.findIndex(u => u.id === id);
          if (index > -1) {
            this.products.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.products);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.toastrService.success('Product deleted successfully.')
          }
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error('Error deleting product.');
        },
        complete: () => {
          console.log('Product deletion completed.');
        } 
      });
  }

}
