import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { sessionGuard } from './guards/session.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {
        path:'auth',
        loadChildren: () => import('./components/pages/pages.routes').then(m=>m.default)
    },
    {
        path: '',
        component:LoginComponent
    }
];

