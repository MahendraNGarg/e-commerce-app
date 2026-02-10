// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint = '/api/categories';

  constructor(private apiService: ApiService) {}

  /**
   * Get all categories
   */
  getCategories(): Observable<PaginatedResponse<Category>> {
    return this.apiService.get<PaginatedResponse<Category>>(`${this.endpoint}/`);
  }

  /**
   * Get a single category
   */
  getCategory(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}/`);
  }

  /**
   * Create a new category
   */
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.apiService.post<Category>(`${this.endpoint}/`, category);
  }

  /**
   * Update a category
   */
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.apiService.put<Category>(`${this.endpoint}/${id}/`, category);
  }

  /**
   * Delete a category
   */
  deleteCategory(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}/`);
  }
}