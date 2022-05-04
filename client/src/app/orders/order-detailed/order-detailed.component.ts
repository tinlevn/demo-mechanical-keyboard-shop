import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';


@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order: Order;

  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService, 
    private orderService: OrdersService) {
      this.breadcrumbService.set('@OrderDetailed', ' ');
     }

  ngOnInit(): void {
    this.orderService.getOrderDetailed(+this.route.snapshot.paramMap.get('id'))
      .subscribe((order: Order) => {
        this.order = order;
        this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
      }, error => {
        console.log(error);
      })
  }
}