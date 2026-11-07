import { Routes } from '@angular/router';

export const requestTypesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./request-types.component').then(m => m.RequestTypesComponent)
  },
  {
    path: 'details',
    loadComponent: () =>
      import('../request-type-details/request-type-details.component').then(m => m.RequestTypeDetailsComponent)
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('../request-type-details/request-type-details.component').then(m => m.RequestTypeDetailsComponent)
  }
];
