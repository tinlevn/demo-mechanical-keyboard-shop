import { Component } from '@angular/core';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Get your best mech keyboard here';
  constructor(private basketService: BasketService){ }

  ngOnInit(): void {
    const basketid=localStorage.getItem('basket_id');
    if (basketid){
      this.basketService.getBasket(basketid).subscribe(()=> {
        console.log('Initialized basket');
      }, error=> {
        console.log(error);
      });
    }
  }
}
