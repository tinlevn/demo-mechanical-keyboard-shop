import { Component, OnInit } from '@angular/core';
import { Brand } from '../shared/models/brand';
import { Product } from '../shared/models/product';
import { Type } from '../shared/models/productType';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[];
  brands: Brand[];
  types: Type[];

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getProducts();
    this.getBrands();
    this.getProductTypes();
  }
  getProducts(){
    this.shopService.getProducts().subscribe(response =>{
      this.products= response.data;
      }, error=>{
        console.log(error);
    });
  }

  getBrands(){
    this.shopService.getBrands().subscribe(response=>{
      this.brands=response;
    }, error=>{
      console.log(error);
  });
  }

  getProductTypes(){
    this.shopService.getTypes().subscribe(response=>{
      this.types=response;
    }, error=>{
      console.log(error);
  });
  }

}
