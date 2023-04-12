import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToBasket() {
    const maxQuantity = this.product.stock - this.basketService.getTotalQuantity(this.product.id);
    const quantityToAdd = this.quantity <= maxQuantity ? this.quantity : maxQuantity;
    if (quantityToAdd > 0) {
      this.basketService.addItemToBasket(this.product, quantityToAdd);
    }
  }

  incrementQuantity() {
    const maxQuantity = this.product.stock - this.basketService.getTotalQuantity(this.product.id);
    if (this.quantity < maxQuantity) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  loadProduct() {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(product => {
      this.product = product;
      console.log(this.product);
    }, error => {
      console.log(error);
    });
  }

  
  boldUpperCase(paragraph: string): string {
    const words = paragraph.split(' ');
    const formattedWords = words.map(word => {
      if (word.toUpperCase() === word) {
        return '<strong>' + word + '</strong>';
      } else {
        return word;
      }
    });
    return formattedWords.join(' ');
  }

}
