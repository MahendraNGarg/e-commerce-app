// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, PaginatedResponse } from './api.service';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name?: string;
  price: string;
  is_featured: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: number;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = '/api/products';

  constructor(private apiService: ApiService) {}

  /**
   * Get all products with optional filters
   */
  getProducts(filters?: ProductFilters): Observable<PaginatedResponse<Product>> {
    return this.apiService.get<PaginatedResponse<Product>>(
      `${this.endpoint}/`,
      filters
    );
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${id}/`);
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(`${this.endpoint}/featured/`);
  }

  /**
   * Create a new product
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.apiService.post<Product>(`${this.endpoint}/`, product);
  }

  /**
   * Update an existing product
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.apiService.put<Product>(`${this.endpoint}/${id}/`, product);
  }

  /**
   * Partially update a product
   */
  patchProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.apiService.patch<Product>(`${this.endpoint}/${id}/`, data);
  }

  /**
   * Delete a product
   */
  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}/`);
  }

  /**
   * Search products
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts({ search: query, page_size: 20 }).pipe(
      map(response => response.results)
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getProducts({ category: categoryId }).pipe(
      map(response => response.results)
    );
  }

  /**
   * Toggle featured status
   */
  toggleFeatured(id: number, isFeatured: boolean): Observable<Product> {
    return this.patchProduct(id, { is_featured: isFeatured });
  }
}