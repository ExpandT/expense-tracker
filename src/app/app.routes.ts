import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transactions.component').then(c => c.TransactionsComponent),
  },
  {
    path: '',
    redirectTo: 'transactions',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'transactions',
    pathMatch: 'full'
  }
];
