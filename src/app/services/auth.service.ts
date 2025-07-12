import { inject, Injectable } from '@angular/core';
import { IAuthority, ILoginResponse, IResponse, IRoleType, IUser } from '../interfaces';
import { Observable, firstValueFrom, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn! : number;
  private user: IUser = {email: '', authorities: []};
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.load();
  }

  public save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));

    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));

    if (this.expiresIn)
      localStorage.setItem('expiresIn',JSON.stringify(this.expiresIn));
  }

  private load(): void {
    let token = localStorage.getItem('access_token');
    if (token) this.accessToken = token;
    let exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    if (!this.accessToken){
      return false;
    } else {
      return true;
    }
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: any) => {
        this.accessToken = response.token;
        this.user.email = credentials.email;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  public hasRole(role: string): boolean {
    return this.user.authorities ?  this.user?.authorities.some(authority => authority.authority == role) : false;
  }

  public isAdmin(): boolean {
    return this.user.authorities ?  this.user?.authorities.some(authority => authority.authority == IRoleType.admin) : false;
  }

  public hasAnyRole(roles: any[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if(route.data && route.data.authorities) {
        if (this.hasAnyRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        } 
      }
    }
    return permittedRoutes;
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/signup', user);
  }

  public logout() {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  public getUserAuthorities (): IAuthority[] | undefined {
    return this.getUser()?.authorities ? this.getUser()?.authorities : [];
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean  {
    // definición de las variables de validación
    let allowedUser: boolean = false;
    let isAdmin: boolean = false;
    // se obtienen los permisos del usuario
    let userAuthorities = this.getUserAuthorities();
    // se valida que sea una ruta permitida para el usuario
    for (const authority of routeAuthorities) {
      if (userAuthorities?.some(item => item.authority == authority) ) {
        allowedUser = userAuthorities?.some(item => item.authority == authority)
      }
      if (allowedUser) break;
    }
    // se valida que el usuario tenga un rol de administración
    if (userAuthorities?.some(item => item.authority == IRoleType.admin)) {
      isAdmin = userAuthorities?.some(item => item.authority == IRoleType.admin);
    }          
    return allowedUser && isAdmin;
  }

  public initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '866761172100-vand4bvk8gn2ap732uijdikpmuano2e8.apps.googleusercontent.com', // Replace with your complete Google Client ID
        callback: this.handleGoogleSignIn.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  }

  public renderGoogleSignInButton(element: HTMLElement): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
      });
    }
  }

  public handleGoogleSignIn(response: any): void {
    if (response.credential) {
      // Decode the JWT token to get user info
      const payload = this.decodeJwtPayload(response.credential);
      
      // Send the token data to your backend
      const tokenData = {
        email: payload.email,
        name: payload.given_name,
        lastname: payload.family_name,
        sub: payload.sub,
        picture: payload.picture
      };

      this.verifyGoogleToken(tokenData).subscribe({
        next: (response: any) => {
          this.accessToken = response.token;
          this.expiresIn = response.expiresIn;
          this.user = response.authUser || {
            email: tokenData.email,
            name: tokenData.name,
            lastname: tokenData.lastname,
            urlImage: tokenData.picture,
            authorities: []
          };
          this.save();
          
          // Redirect to dashboard
          window.location.href = '/app/dashboard';
        },
        error: (error) => {
          console.error('Google Sign-In error:', error);
        }
      });
    }
  }

  public verifyGoogleToken(tokenData: any): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/google/verify', tokenData);
  }

  private decodeJwtPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  public signInWithGoogle(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.prompt();
    }
  }

  public handleGoogleCallback(token: string, expiresIn: number): void {
    this.accessToken = token;
    this.expiresIn = expiresIn;
    // The user data should be included in the callback or fetched separately
    this.save();
  }
}
