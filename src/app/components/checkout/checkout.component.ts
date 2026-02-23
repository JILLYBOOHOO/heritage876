import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSub!: Subscription;

  // Multi-step: 1 = Cart Review, 2 = Shipping, 3 = Payment, 4 = Confirmation
  currentStep = 1;

  // Shipping form
  shipping = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    parish: '',
    zip: ''
  };

  // Payment form
  payment = {
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  };

  // Payment processing state
  isProcessing = false;
  orderNumber = '';

  parishes = [
    'Kingston', 'St. Andrew', 'St. Thomas', 'Portland',
    'St. Mary', 'St. Ann', 'Trelawny', 'St. James',
    'Hanover', 'Westmoreland', 'St. Elizabeth', 'Manchester',
    'Clarendon', 'St. Catherine'
  ];

  constructor(public cartService: CartService) { }

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }

  get subtotal(): number {
    return this.cartService.getTotal();
  }

  get shipping_cost(): number {
    return this.subtotal > 10000 ? 0 : 500;
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.15);
  }

  get total(): number {
    return this.subtotal + this.shipping_cost + this.tax;
  }

  updateQuantity(name: string, qty: number) {
    this.cartService.updateQuantity(name, qty);
  }

  removeItem(name: string) {
    this.cartService.removeFromCart(name);
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isShippingValid(): boolean {
    return !!(
      this.shipping.fullName &&
      this.shipping.email &&
      this.shipping.phone &&
      this.shipping.address &&
      this.shipping.city &&
      this.shipping.parish
    );
  }

  isPaymentValid(): boolean {
    return !!(
      this.payment.cardNumber.length >= 16 &&
      this.payment.cardName &&
      this.payment.expiry.length >= 5 &&
      this.payment.cvv.length >= 3
    );
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = formatted;
    this.payment.cardNumber = value;
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
    this.payment.expiry = value;
  }

  processPayment() {
    if (!this.isPaymentValid()) return;

    this.isProcessing = true;

    // Mock payment gateway simulation
    setTimeout(() => {
      this.isProcessing = false;
      this.orderNumber = 'HRT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      this.currentStep = 4;
      this.cartService.clearCart();
    }, 2500);
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }
}
