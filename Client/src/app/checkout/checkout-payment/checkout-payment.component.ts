import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IAddress } from 'src/app/shared/models/adress';
import { IBasket } from 'src/app/shared/models/basket';
import {  Order, OrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  constructor(private BasketService: BasketService, private CheckoutService: CheckoutService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(){
  }

  submitOrder() {
    const basket = this.BasketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.CheckoutService.createOrder(orderToCreate).subscribe((order: Order) => {
      this.toastr.success('Order Created successfully');
      this.BasketService.deleteLocalBasket(basket.id);
      const navigationExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navigationExtras);
      console.log(order);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    })
  }
  private getOrderToCreate(basket: IBasket): OrderToCreate {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as IAddress;
    if (!deliveryMethodId || !shipToAddress) throw new Error('Problem with basket');
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }

}
