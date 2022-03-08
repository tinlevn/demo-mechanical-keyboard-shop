import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketTotals } from '../../models/basket';

@Component({
  selector: 'app-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.scss']
})
export class OrderTotalComponent implements OnInit {
  basketTotal$: Observable<BasketTotals>

  constructor(private basketService: BasketService) { }

  ngOnInit(){
    this.basketTotal$=this.basketService.basketTotal$;
  }

}
