import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  cartCount = 0;
  private cartSub!: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getItemCount();
    });
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
