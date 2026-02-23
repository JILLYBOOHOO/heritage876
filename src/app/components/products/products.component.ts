import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = [
    { name: 'Domino Board', price: '6,500', description: 'Authentic Jamaican domino board made from premium wood, perfect for game nights and gatherings.', image: '/dominoboardja.jpg' },
    { name: 'Jamaican Domino', price: '2,500', description: 'Classic double-six domino set complete with traditional markings.', image: '/jadomino.jpg' },
    { name: 'Ludi Board', price: '5,500', description: 'Traditional Jamaican Ludi board for endless family fun and competitive play.', image: '/jaludiboard.jpg' },
    { name: 'Jamaican Dice', price: '1,500', description: 'Set of traditional playing dice, an essential for many local games.', image: '/jadice.jpg' },
    { name: 'Fever Grass', price: '1,200', description: 'Freshly dried fever grass (lemongrass), great for making authentic Jamaican bush tea.', image: '/fevergrass.jpeg' },
    { name: 'Soursop Leaf', price: '1,800', description: 'High-quality soursop leaves, traditionally used locally for tea and natural wellness remedies.', image: '/soursopleaf.jpeg' }
  ];

  addedProduct: string | null = null;

  constructor(private cartService: CartService) { }

  addToCart(product: { name: string; price: string; image: string }) {
    this.cartService.addToCart(product);
    this.addedProduct = product.name;
    setTimeout(() => {
      this.addedProduct = null;
    }, 1500);
  }
}
