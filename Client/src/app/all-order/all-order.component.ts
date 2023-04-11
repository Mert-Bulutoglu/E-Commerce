import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Order } from '@stripe/stripe-js';
import { OrdersService } from '../orders/orders.service';
import { AllOrderService } from './all-order.service';
import { ConfirmationDialog } from '../shared/models/confirmation-dialog';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-all-order',
  templateUrl: './all-order.component.html',
  styleUrls: ['./all-order.component.scss']
})
export class AllOrderComponent implements AfterViewInit {

  orders: Order[] = []
  dataSource: MatTableDataSource<Order>;
  displayedColumns: string[] = ['buyerEmail',  'firstName', 'lastName', 'deliveryMethod','orderDate','status', 'total','action'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedOrder: Order | null
  showOrderModal: boolean = false;
  selectedOrder: Order;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private orderService: AllOrderService
  ) { 
    this.dataSource = new MatTableDataSource(this.orders);
  }

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: (data: any[]) => {
        this.orders = data;
        console.log(this.orders);
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) =>{
        console.log(err);
      },
      complete: () => {
        console.log("get order completed.");
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
    const selectedOrder: Order = this.orders.find(u => u.id === id);
    const data: ConfirmationDialog = {
      message: `Are you sure you want to remove the order.'`,
      data: selectedOrder
    }
    const dialogRef = this.dialogRef.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) this.deleteOrder(selectedOrder.id);
    });
  }

  showOrderDetails(id: number | string): void {
    this.router.navigate(['/all-order', id]) ;
  }

  showProducDetails(id: number | string): void {
    this.router.navigate(['/orders', id]) ;
  }

  deleteOrder(id: number | string) {
    this.orderService.deleteOrder(id)
      .subscribe({
        next: () => {
          const index = this.orders.findIndex(u => u.id === id);
          if (index > -1) {
            this.orders.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.orders);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('Order deletion completed.');
        } 
      });
  }



}
