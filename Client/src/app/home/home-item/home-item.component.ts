import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['./home-item.component.scss']
})
export class HomeItemComponent implements OnInit {

  @Input() product: IProduct;

  constructor(private basketService: BasketService, private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  addItemToBasket() {
    if (this.product.stock === 0) {
      console.log('Üzgünüz, bu ürün stokta yok.');
      this.toastrService.error(`Sorry, this product "${this.product.name}" is out of stock.`);
      return;
    }
    const existingItem = this.basketService.getItem(this.product.id);
    console.log(existingItem);
    if (existingItem) {
      if (existingItem.quantity + 1 > this.product.stock) {
        console.log('Üzgünüz, stokta yeterli ürün yok.');
        this.toastrService.error(`Sorry, there is not enough stock for "${this.product.name}".`);
        return;
      }
    }
    this.basketService.addItemToBasket(this.product);
    this.toastrService.success(`"${this.product.name}" successfully added the basket.`);

  }

}
