import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: "",
        component: LoginComponent,
    },
    {
        path: "dashboard",
        component: DashboardComponent
    },
    {
        path:"welcome",
        component: WelcomeComponent
    },
    {
        path:"**",
        component:LoginComponent
    }
];

