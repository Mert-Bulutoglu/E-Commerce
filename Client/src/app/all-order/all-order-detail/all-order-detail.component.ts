import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '@stripe/stripe-js';
import { IUpdateOrder } from 'src/app/shared/models/updateOrder';
import { AllOrderService } from '../all-order.service';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from 'src/app/shared/models/order';
import { IAddress } from 'src/app/shared/models/adress';
import { OrderStatus } from 'src/app/shared/models/orderStatus';

interface OrderWithAddress extends Order {
  shipToAddress: IAddress; // add the shipToAddress property to the Order interface
}

@Component({
  selector: 'app-all-order-detail',
  templateUrl: './all-order-detail.component.html',
  styleUrls: ['./all-order-detail.component.scss']
})
export class AllOrderDetailComponent implements OnInit {

  form: UntypedFormGroup;
  orderContract: OrderWithAddress;
  orderItem: OrderItem;
  statusList: { name: string }[] = [
    { name: OrderStatus.Pending },
    { name: OrderStatus.PaymentReceived },
    { name: OrderStatus.PaymentFailed },
    { name: OrderStatus.Processing },
    { name: OrderStatus.Shipped },
    { name: OrderStatus.Delivered },
    { name: OrderStatus.Cancelled },
    { name: OrderStatus.Refunded }
];

   constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private orderService: AllOrderService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    const orderId: string = this.route.snapshot.paramMap.get('id');

    if (orderId) {
      this.getOrder(orderId);
      this.form = this.fb.group({
        firstName: [''],
        lastName: [''],
        state: [''],
        street: [''],
        zipCode: [''],
        status: ['', [Validators.required]]
      });
    }
    else {
      this.form = this.fb.group({
        firstName: [''],
        lastName: [''],
        state: [''],
        street: [''],
        zipCode: [''],
        status: ['', [Validators.required]]
      });
    }
  }

  getOrder(orderId: string) {
    this.orderService.getOrder(orderId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.orderContract = data;
          this.prefillForm();
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('get by id completed');
        }
      });
  }

  updateOrder(id: number, form: UntypedFormGroup) {
    if (form.valid) {
      const order: IUpdateOrder = form.value;
      order.id = id;
      console.log(order);
      this.orderService.updateOrder(id, order)
        .subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('order update completed');
          }
        })
    }
  }

  handleSaveButton(form: UntypedFormGroup) {
    console.log(form.value);
    if (this.orderContract) {
      const orderId = parseInt(this.orderContract.id, 10);
      this.updateOrder(orderId, form);
    } 
  }

  prefillForm(): void {
    this.firstName.setValue(this.orderContract.shipToAddress.firstName);
    this.lastName.setValue(this.orderContract.shipToAddress.lastName);
    this.state.setValue(this.orderContract.shipToAddress.state);
    this.street.setValue(this.orderContract.shipToAddress.street);
    this.zipCode.setValue(this.orderContract.shipToAddress.zipCode);
    this.status.setValue(this.orderContract.status);
  }


  get firstName(): any {
    return this.form.get('firstName');
  }

  get lastName(): any {
    return this.form.get('lastName');
  }

  get state(): any {
    return this.form.get('state');
  }

  get street(): any {
    return this.form.get('street');
  }

  get zipCode(): any {
    return this.form.get('zipCode');
  }

  get status(): any {
    return this.form.get('status');
  }


}
