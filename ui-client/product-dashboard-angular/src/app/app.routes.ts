import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/assignment',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products.component').then(m => m.ProductListComponent)
  },
  {
    path: 'assignment',
    loadComponent: () => import('./assignment/assignment.component').then(m => m.AssignmentComponent)
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
