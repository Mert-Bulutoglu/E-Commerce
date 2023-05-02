import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';
import { ProductService } from '../product/product.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.baseUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient, private productService: ProductService, private toastrService: ToastrService) { }

  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      )
  }

  getItem(id: number): IBasketItem {
    const basket = this.getCurrentBasketValue();
    if (!basket || !basket.items) {
      return null; 
    }
    return basket.items.find(item => item.id === id);
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateTotals();
    this.setBasket(basket);
  }


  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.shipping = basket.shippingPrice;
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error)
    }
    )
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({ shipping, total, subtotal });
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    const maxQuantity = item.stock - this.getTotalQuantity(item.id);
    const quantityToAdd = quantity <= maxQuantity ? quantity : maxQuantity;
    if (quantityToAdd > 0) {
      const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantityToAdd);
      basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantityToAdd);
      this.setBasket(basket);
    }
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const product$ = this.productService.getProduct(item.id.toString());
  
    product$.subscribe(product => {
      const maxQuantity = product.stock - this.getTotalQuantity(item.id);
      if (item.quantity + 1 <= maxQuantity) { // check if it's possible to increment quantity
        const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
        basket.items[foundItemIndex].quantity++;
        this.setBasket(basket);
        this.toastrService.success(`Quantity of "${product.name}" has been increased to ${basket.items[foundItemIndex].quantity}.`);
      } else {
        this.toastrService.warning(`The maximum quantity for "${product.name}" has been reached.`);
      }
    }); 
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }



  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
        this.toastrService.success(`"${item.productName}" has been removed from the basket.`);
      } else {
        this.deleteBasket(basket);
        this.toastrService.success('Basket has been deleted.');
      }
    }
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id')
    }, error => {
      console.log(error);
    })
  }

  getTotalQuantity(productId: number): number {
    const basket = this.getCurrentBasketValue();
    let totalQuantity = 0;
  
    if (basket) {
      for (let item of basket.items) {
        if (item.id === productId) {
          totalQuantity += item.quantity;
        }
      }
    }
  
    return totalQuantity;
  }



  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }


  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }


  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

}
