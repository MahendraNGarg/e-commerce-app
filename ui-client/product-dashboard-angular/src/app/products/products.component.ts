// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductFilters } from '../datasources/product.service';
import { CategoryService, Category } from '../datasources/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './products.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./products.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filters: ProductFilters = {};
  isLoading = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.results;
      },
      error: (error) => {
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  toggleFeatured(product: Product): void {
    this.productService.toggleFeatured(product.id, !product.is_featured).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
      },
      error: (error) => {
        console.error('Error toggling featured:', error);
      }
    });
  }
}