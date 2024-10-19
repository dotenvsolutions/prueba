import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { sessionGuard } from './guards/session.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {
        path: "",
        component: LoginComponent,
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate:[sessionGuard]
    },
    {
        path:"welcome",
        component: WelcomeComponent,
        canActivate:[sessionGuard]
    },
    {
        path:"profile",
        component: ProfileComponent,
        canActivate:[sessionGuard]
    },
    {
        path:"**",
        component:LoginComponent
    }
];

