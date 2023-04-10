import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeliveryMethodService } from './delivery-method.service';
import { ConfirmationDialog } from '../shared/models/confirmation-dialog';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-delivery-method',
  templateUrl: './delivery-method.component.html',
  styleUrls: ['./delivery-method.component.scss']
})
export class DeliveryMethodComponent implements AfterViewInit {

  deliveryMethods: IDeliveryMethod[] = []
  dataSource: MatTableDataSource<IDeliveryMethod>;
  displayedColumns: string[] = ['shortName','deliveryTime', 'price','action'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedDeliveryMethod: IDeliveryMethod | null
  showDeliveryMethodModal: boolean = false;
  selectedDeliveryMethod: IDeliveryMethod;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private deeliveryMethodService: DeliveryMethodService
  ) { 
    this.dataSource = new MatTableDataSource(this.deliveryMethods);
  }


  ngOnInit() {
    this.deeliveryMethodService.getAllDeliveryMethods().subscribe({
      next: (data: any[]) => {
        this.deliveryMethods = data;
        console.log(this.deliveryMethods);
        this.dataSource = new MatTableDataSource(this.deliveryMethods);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) =>{
        console.log(err);
      },
      complete: () => {
        console.log("get delivery method completed.");
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
    const selectedDeliveryMethod: IDeliveryMethod = this.deliveryMethods.find(u => u.id === id);
    const data: ConfirmationDialog = {
      message: `Are you sure you want to remove the delivery method '${selectedDeliveryMethod.shortName}'`,
      data: selectedDeliveryMethod
    }
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) this.deleteDeliveryMethod(selectedDeliveryMethod.id);
    });
  }

  showDeliveryMethodDetails(id: number | string): void {
    this.router.navigate(['/delivery-method', id]) ;
  }

  deleteDeliveryMethod(id: number | string) {
    this.deeliveryMethodService.deleteDeliveryMethod(id)
      .subscribe({
        next: () => {
          const index = this.deliveryMethods.findIndex(u => u.id === id);
          if (index > -1) {
            this.deliveryMethods.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.deliveryMethods);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('Delivery method deletion completed.');
        } 
      });
  }

}
