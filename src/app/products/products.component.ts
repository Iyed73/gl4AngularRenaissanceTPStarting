import { Component, computed, effect, signal} from '@angular/core';
import { resource } from '@angular/core/primitives';

import { ProductService } from './services/product.service';
import { Product } from './dto/product.dto';
import { Settings } from './dto/product-settings.dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  settings = signal<Settings>({ limit: 12, skip: 0 });

  isLoading = signal(false);
  noMoreProducts = signal(false);

  allProducts = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  productsResource = resource({
    request: () => {
      this.isLoading.set(true);
      return this.settings();
    },

    loader: ({ request }) =>
      this.productService.getProducts(request),
  });

  productsEffect = effect(() => {
    const res = this.productsResource.value();

    if (!res) return;

    if (res.products.length === 0) {
      this.noMoreProducts.set(true);
      this.isLoading.set(false);
      return;
    }

    this.allProducts.update(p => [...p, ...res.products]);

    this.isLoading.set(false);
  });

  loadMoreProducts() {
    if (this.noMoreProducts()) return;

    const { limit, skip } = this.settings();

    this.settings.set({
      limit,
      skip: skip + limit
    });
  }
}
