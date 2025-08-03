import { Component, OnInit, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: "./my-account.component.html",
})
export class MyAccountComponent {
  public service = inject(AuthService);
  public router = inject(Router);

  constructor() {
    // effect(() => {
    //   const user = this.service.user$();
    //   if (user && user.name) {
    //     this.userName = user.name;
    //   }
    // });
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
