import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals, BasketUnique } from '../shared/models/basket';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource= new BehaviorSubject<Basket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) { }
 
  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})
      .pipe(
        map((basket: Basket) => {
          this.basketSource.next(basket);
        })
      );
  }

  setShippingPrice(deliveryMethod: DeliveryMethod){
    this.shipping= deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId  = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateTotal();
    this.setBasket(basket);
  }

  getBasket(id: string) {
    return this.http.get(this.baseUrl +'basket?Id=' + id)
    .pipe(
      map((basket: Basket) => {
        this.basketSource.next(basket);
        this.shipping = basket.shippingPrice;
        this.calculateTotal();
      })
    );
  }
  
  setBasket(basket: Basket){
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: Basket) =>
    {
      this.basketSource.next(response);
      this.calculateTotal();
    }, error => {
      console.log(error);
    });
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item: Product, quantity=1){
    const itemToAdd: BasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items =this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: BasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex= basket.items.findIndex(x=>x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: BasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x=>x.id === item.id);
    if (basket.items[foundItemIndex].quantity>1){
      basket.items[foundItemIndex].quantity--;
    } else {
      this.removeItemFromBasket(item);
    }
  }
  
  removeItemFromBasket(item: BasketItem) {
    const basket = this.getCurrentBasketValue();

    if (basket.items.some(x=> x.id ===item.id)){
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length>0){
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => 
    {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

  private calculateTotal(){
    const basket=this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a,b)=> (b.price* b.quantity) + a, 0);
    const total = subtotal+ shipping;
    this.basketTotalSource.next({shipping, total,subtotal});
  }


  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    console.log(items);
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1 ){
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else{
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): Basket {
    const basket= new BasketUnique();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  deleteLocalBakset(id: string){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private mapProductItemToBasketItem(item: Product, quantity: number): BasketItem {
    return {
       id: item.id,
       productName: item.name,
       price: item.price,
       quantity,
       pictureUrl: item.pictureURL,
       brand: item.productBrand,
       type: item.productType
    };
  }

}
