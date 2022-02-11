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
  shopparams= new ShopParams();

  sortOptions=[
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price low to high', value: 'priceAsc'},
    {name: 'Price high to low', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getProducts();
    this.getBrands();
    this.getProductTypes();
  }
  getProducts(){
    this.shopService.getProducts(this.shopparams).subscribe(response =>{
      this.products= response.data;
      this.shopparams.pageNumber=response.pageIndex;
      this.shopparams.pageSize=response.pageSize;
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
    this.shopparams.brandId = brandId;
    this.shopparams.pageNumber=1;
    this.getProducts();
  }
 
  onTypeSelected(typeId: number){
    this.shopparams.typeId = typeId;
    this.shopparams.pageNumber=1;
    this.getProducts();
  }

  onSortSelected(sort: string){
    this.shopparams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any){
    if (this.shopparams.pageNumber !== event){
      this.shopparams.pageNumber=event;
      this.getProducts();
    }
  }

  onSearch(){
    this.shopparams.search = this.searchTerm.nativeElement.value;
    this.shopparams.pageNumber=1;
    this.getProducts();
  }

  onReset(){
    this.searchTerm.nativeElement.value='';
    this.shopparams = new ShopParams();
    this.getProducts();
  }

}
