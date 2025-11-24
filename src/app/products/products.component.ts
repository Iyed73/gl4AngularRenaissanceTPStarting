import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';
import { Product } from './dto/product.dto';
import { Settings } from './dto/product-settings.dto';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductApiResponse } from './dto/product-api-response.dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsComponent {
  settings = signal<Settings>({ limit: 12, skip: 0 });
  isLoading = signal(false);
  noMoreProducts = signal(false);
  allProducts = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  Rsrc = rxResource<ProductApiResponse, Settings>({
    params: this.settings, 
    stream: ({ params }) => this.productService.getProducts(params), 
  });

  productsEffect = effect(() => {
    const res = this.Rsrc.value();
    if (!res) return;

    if (!res.products || res.products.length === 0) {
      this.noMoreProducts.set(true);
      this.isLoading.set(false);
      return;
    }

    this.allProducts.update(prev => [...prev, ...res.products]);
    this.isLoading.set(false);
  });

  loadMoreProducts() {
    if (this.noMoreProducts()) return;

    this.isLoading.set(true);
    const { limit, skip } = this.settings();
    this.settings.set({ limit, skip: skip + limit });
  }
}
