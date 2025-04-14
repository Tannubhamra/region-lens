import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadChildren: () => import('./features/region-lens/region-lens.routes').then((m) => m.RegionLenseRoutes)
    }
];
