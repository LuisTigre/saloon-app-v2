import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => 
            import('./pages/home/home.component').then((c) => c.HomeComponent)

    },
    {
        path: 'services',
        loadComponent: () => 
            import('./pages/menu-service/menu-service.component').then((c) => c.MenuServiceComponent)

    },
    
];
