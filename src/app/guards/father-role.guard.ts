import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { IRoleType } from "../interfaces";

@Injectable({
  providedIn: 'root',
})
export class FatherRoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    var hasRole = false;
    
    // this way the father or the admin can access the route
    if ((this.authService.hasRole(IRoleType.father)) || (this.authService.hasRole(IRoleType.admin))) {
     var hasRole=true};
  
    if (!hasRole) {
      this.router.navigate(['access-denied']);
      return false;
    }
    return true;
  }
}