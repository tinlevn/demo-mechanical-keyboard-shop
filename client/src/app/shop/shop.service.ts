import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl= 'https://localhost:7180/api/';

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get<Pagination>(this.baseUrl+ 'products');
  }

}
