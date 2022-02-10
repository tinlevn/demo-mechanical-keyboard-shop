import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import {Brand} from '../shared/models/brand';
import {Type} from '../shared/models/productType';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl= 'https://localhost:7180/api/';

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get<Pagination>(this.baseUrl+ 'products');
  }

  getBrands(){
    return this.http.get<Brand[]>(this.baseUrl+'products/brands');
  }
  getTypes(){
    return this.http.get<Type[]>(this.baseUrl+'products/types');
  }
}
