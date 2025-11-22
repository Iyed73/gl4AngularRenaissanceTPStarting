import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  tap,
  switchMap,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  
  private obs$ = new BehaviorSubject<Settings>({ limit: 12, skip: 0 });

  products$!: Observable<Product[]>;
  isLoading = false;
  noMoreProducts = false;
  constructor(private productService: ProductService) {

  this.products$ = this.obs$.pipe(
  map(settings => {
    this.isLoading = true;
    return settings;
  }),
  concatMap(settings => this.productService.getProducts(settings)),
  tap(response => {
    if (response.products.length === 0) {
      this.noMoreProducts = true;
      this.isLoading = false;
    }
  }),
  takeWhile(response => response.products.length > 0, true),
  scan((allProducts: Product[], response) => {
    this.isLoading = false;
    return [...allProducts, ...response.products];
  }, []),

);

  }

  loadMoreProducts() {
    const { limit, skip } = this.obs$.value;

    this.obs$.next({
      limit,
      skip: skip + limit,
    });
  }
}
