import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Brand } from '../shared/models/brand';
import { Product } from '../shared/models/product';
import { Type } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})

export class ShopComponent implements OnInit {
  @ViewChild('search' , {static: true}) searchTerm: ElementRef; 
  products: Product[];
  brands: Brand[];
  types: Type[];
  totalCount: number;
  shopParams: ShopParams;

  sortOptions=[
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price low to high', value: 'priceAsc'},
    {name: 'Price high to low', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
   }

  ngOnInit() {
    this.getProducts(true);
    this.getBrands();
    this.getProductTypes();
  }
  getProducts(useCache = false){
    this.shopService.getProducts(useCache).subscribe(response =>{
      this.products= response.data;
      this.totalCount=response.count;
      }, error=>{
        console.log(error);
    });
  }

  getBrands(){
    this.shopService.getBrands().subscribe(response=>{
      this.brands = [ {id:0, name:'All'} , ...response];
    }, error=>{
      console.log(error);
  });
  }

  getProductTypes(){
    this.shopService.getTypes().subscribe(response=>{
      this.types= [ {id:0, name:'All'} , ...response];
    }, error=>{
      console.log(error);
  });
  }

  onBrandSelected(brandId: number){
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber=1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
 
  onTypeSelected(typeId: number){
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber=1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(sort: string){
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChanged(event: any){
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event){
      params.pageNumber=event;
      this.shopService.setShopParams(params); 
      this.getProducts(true);
    }
  }

  onSearch(){
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber=1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onReset(){
    this.searchTerm.nativeElement.value='';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

}
