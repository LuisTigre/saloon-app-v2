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
    {
        path: 'schedule',
        loadComponent: () => 
            import('./pages/schedule/schedule.component').then((c) => c.ScheduleComponent)

    },
    {
        path: 'catalog',
        loadComponent: () => 
            import('./pages/catalog/catalog.component').then((c) => c.CatalogComponent)

    },
    {
        path: 'product_details',
        loadComponent: () => 
            import('./pages/product-details/product-details.component').then((c) => c.ProductDetailsComponent)

    },
    {
        path: 'bookings',
        loadComponent: () => 
            import('./pages/bookings/bookings.component').then((c) => c.BookingsComponent)

    },
    
];
