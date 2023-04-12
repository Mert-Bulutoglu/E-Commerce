import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['./home-item.component.scss']
})
export class HomeItemComponent implements OnInit {

  @Input() product: IProduct;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product);
  }

}
