import { Routes } from '@angular/router';
 
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'request-types', 
    pathMatch: 'full' 
  },
  { 
    path: 'request-types', 
    
    loadChildren: () => 
      import('./pages/request-types/request-types.routes').then(m => m.requestTypesRoutes)
  },
  { 
    path: '**', 
    redirectTo: 'request-types' 
  }
];
