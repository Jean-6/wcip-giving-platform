import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';


export type ProductCategory = 'bible' | 'livre' | 'jeunesse' | 'musique';

export interface Product {
  id: string;
  category: ProductCategory;
  categoryLabel: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
}

interface CartLine {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPage {
  categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tout' },
    { id: 'bible', label: 'Bibles' },
    { id: 'livre', label: 'Livres' },
    { id: 'jeunesse', label: 'Jeunesse' },
    { id: 'musique', label: 'Musique' },
  ];

  activeCategory = signal<ProductCategory | 'all'>('all');

  products: Product[] = [
    {
      id: 'bible-louis-segond',
      category: 'bible',
      categoryLabel: 'Bible',
      title: 'Bible Louis Segond — Couverture rigide',
      author: 'Société Biblique',
      price: 24.9,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
      description: 'Traduction classique, couverture rigide, idéale pour l\'étude personnelle ou en groupe.',
    },
    {
      id: 'livre-priere',
      category: 'livre',
      categoryLabel: 'Livre',
      title: 'Le pouvoir de la prière persévérante',
      author: 'David Oyedepo',
      price: 14.5,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
      description: 'Un enseignement profond sur la persévérance dans la prière et la foi.',
    },
    {
      id: 'livre-foi',
      category: 'livre',
      categoryLabel: 'Livre',
      title: 'Vivre par la foi',
      author: 'David Oyedepo',
      price: 13.9,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop',
      description: 'Comment marcher au quotidien dans une foi vivante et agissante.',
    },
    {
      id: 'jeunesse-histoires',
      category: 'jeunesse',
      categoryLabel: 'Jeunesse',
      title: 'Mes premières histoires bibliques',
      author: 'Collectif',
      price: 11.9,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
      description: 'Un livre illustré pour découvrir les grands récits bibliques dès le plus jeune âge.',
    },
    {
      id: 'musique-louange',
      category: 'musique',
      categoryLabel: 'Musique',
      title: 'Album — Louange & Adoration Vol. 3',
      author: 'Chorale Grâce & Lumière',
      price: 12.0,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
      description: 'Le dernier album studio de notre chorale, 12 titres de louange originaux.',
    },
  ];

  // Cart state
  cart = signal<CartLine[]>([]);
  cartOpen = signal(false);
  isCheckingOut = signal(false);

  get filteredProducts(): Product[] {
    const cat = this.activeCategory();
    if (cat === 'all') return this.products;
    return this.products.filter(p => p.category === cat);
  }

  cartCount = computed(() =>
    this.cart().reduce((sum, line) => sum + line.quantity, 0)
  );

  cartTotal = computed(() =>
    this.cart().reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  );

  setCategory(cat: ProductCategory | 'all'): void {
    this.activeCategory.set(cat);
  }

  addToCart(product: Product): void {
    this.cart.update(lines => {
      const existing = lines.find(l => l.product.id === product.id);
      if (existing) {
        return lines.map(l =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...lines, { product, quantity: 1 }];
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cart.update(lines =>
      lines.map(l => (l.product.id === productId ? { ...l, quantity } : l))
    );
  }

  removeFromCart(productId: string): void {
    this.cart.update(lines => lines.filter(l => l.product.id !== productId));
  }

  toggleCart(): void {
    this.cartOpen.update(v => !v);
  }

  checkout(): void {
    if (this.cart().length === 0) return;
    this.isCheckingOut.set(true);

    // TODO: replace with the real Stripe Checkout call for the shop
    // (separate from donations — likely its own backend endpoint that
    // builds line_items from the cart).
    setTimeout(() => {
      this.isCheckingOut.set(false);
      alert('Redirection vers le paiement (à connecter à Stripe Checkout pour la boutique).');
    }, 1000);
  }
}
