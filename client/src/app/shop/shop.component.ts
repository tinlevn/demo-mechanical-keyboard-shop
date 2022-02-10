import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[];

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.shopService.getProducts().subscribe(response =>{
      this.products= response.data;
    }, error=>{
      console.log(error);
    });
  }

}
