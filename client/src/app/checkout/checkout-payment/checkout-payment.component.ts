import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket } from 'src/app/shared/models/basket';
import { Order } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService,
    private toaster: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  submitOrder(){
    const basket = this.basketService.getCurrentBasketValue();
    const OrderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(OrderToCreate).subscribe((order: Order)=>
    {
      this.toaster.success('Order created successfully');
      this.basketService.deleteLocalBakset(basket.id);
      const navigationExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navigationExtras )
    }, error =>{
      this.toaster.error(error.message);
      console.log(error)
    });
  }

  private getOrderToCreate(basket: Basket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    }
  }
}
