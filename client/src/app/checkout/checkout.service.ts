import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {environment} from 'src/environments/environment'
import { OrderTotalComponent } from '../shared/components/order-total/order-total.component';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { OrderToCreate } from '../shared/models/order';
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  createOrder(order: OrderToCreate){
    return this.http.post(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods(){
    return this.http.get(this.baseUrl + 'orders/deliveryMethods').pipe(
      map((dm: DeliveryMethod[]) => {
        return dm.sort((a,b) => b.price - a.price);
      })
    );
  }
}
