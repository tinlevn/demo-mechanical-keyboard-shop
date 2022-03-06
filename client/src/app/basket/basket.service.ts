import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals, BasketUnique } from '../shared/models/basket';
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

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get(this.baseUrl +'basket?Id=' + id)
    .pipe(
      map((basket: Basket) => {
        this.basketSource.next(basket);
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

  private calculateTotal(){
    const basket=this.getCurrentBasketValue();
    const shipping = 0;
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
