import { Routes } from '@angular/router';
import { sessionGuard } from '../../guards/session.guard';
import { LoginComponent } from '../auth/login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from '../auth/profile/profile.component';
import { LogoutComponent } from '../auth/logout/logout.component';
 
const pagesRoutes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'welcome',
        component:WelcomeComponent,
        canActivate: [sessionGuard]
    },
    {
        path: 'dashboard',
        component:DashboardComponent,
        canActivate: [sessionGuard]
    },
    {
        path: 'profile',
        component:ProfileComponent,
        canActivate: [sessionGuard]
    },
    {
        path:'logout',
        component: LogoutComponent,
        canActivate: [sessionGuard]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

export default pagesRoutes