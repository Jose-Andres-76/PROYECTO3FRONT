import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { FatherRoleGuard } from './guards/father-role.guard';
import { SonRoleGuard } from './guards/son-role-guard.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PasswordRecoveryComponent } from './pages/auth/password-recovery/password-recovery.component';
import { ListingComponent } from './pages/listing/listing.component';
import { GarbageScannerPageComponent } from './pages/garbage-scanner/garbage-scanner.component';
import { CollectionCentersComponent } from './components/collection-centers/collection-centers.component';
import { GoogleCallbackComponent } from './pages/auth/google-callback/google-callback.component';



export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
     canActivate: [GuestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'password-recovery',
    component: PasswordRecoveryComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'auth/google/callback',
    component: GoogleCallbackComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'family',
        component: ListingComponent,
        canActivate:[FatherRoleGuard],
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.father,
          ],
          name: 'Mi Familia',
          showInSidebar: true,
          iconPath: 'assets/icons/sidebar/people-roof-solid.svg'
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRoleType.admin
          ],
          name: 'Usuarios',
          showInSidebar: true,
          iconPath: 'assets/icons/sidebar/users-solid.svg'
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.father,
            IRoleType.son
          ],
          name: 'Dashboard',
          showInSidebar: false,
          iconPath: 'assets/icons/sidebar/users-solid.svg'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.father,
            IRoleType.son
          ],
          name: 'profile',
          showInSidebar: false,
          iconPath: 'assets/icons/sidebar/users-solid.svg'
        }
      },
    
      {
        path: 'collection-centers',
        component: CollectionCentersComponent,
        canActivate: [AuthGuard],
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.father,
            IRoleType.son,
          ],
          name: 'Centros de Acopio',
          showInSidebar: true,
          iconPath: 'assets/icons/sidebar/compass-regular.svg'
        }
      },
        {
        path: 'garbage-scanner',
        component: GarbageScannerPageComponent,
        canActivate: [AuthGuard],
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.father,
            IRoleType.son,
          ],
          name: 'Escáner de Basura',
          showInSidebar: true,
          iconPath: 'assets/icons/sidebar/magnifying-glass-solid (1).svg'
        }
      }
      
    ],
  },
   { path: '**', redirectTo: '' }
];
