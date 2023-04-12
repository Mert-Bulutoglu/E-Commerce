import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from '../shop/shop.service';
import { BasketService } from '../basket/basket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: IProduct[];
  totalCount: number;

  shopParams = new ShopParams();
  constructor(
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

 

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
      console.log(this.products);
    }, error => {
      console.log(error);
    });
  }

}
