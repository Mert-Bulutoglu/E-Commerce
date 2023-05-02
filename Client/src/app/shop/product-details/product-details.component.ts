import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { CdkStepper } from '@angular/cdk/stepper';
import { ToastrService } from 'ngx-toastr';

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
    private basketService: BasketService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToBasket() {
    if (this.product.stock === 0) {
      console.log('Üzgünüz, bu ürün stokta yok.');
      this.toastrService.error(`Sorry, this product "${this.product.name}" is out of stock.`);
      return;
    }
  
    const maxQuantity = this.product.stock - this.basketService.getTotalQuantity(this.product.id);
    const quantityToAdd = this.quantity <= maxQuantity ? this.quantity : maxQuantity;
  
    if (quantityToAdd > 0) {
      this.basketService.addItemToBasket(this.product, quantityToAdd);
      this.toastrService.success(`"${this.product.name}" has been added to your basket.`);
    } else {
      this.toastrService.error(`Sorry, there is not enough stock for "${this.product.name}".`);
    }
  }

  incrementQuantity() {
    const maxQuantity = this.product.stock - this.basketService.getTotalQuantity(this.product.id);
    if (this.quantity < maxQuantity) {
      this.quantity++;
      this.toastrService.success(`Quantity of "${this.product.name}" has been increased to ${this.quantity}.`);
    } else {
      this.toastrService.warning(`The maximum quantity for "${this.product.name}" has been reached.`);
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
      this.toastrService.error(`Error occurred while retrieving data`);
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
