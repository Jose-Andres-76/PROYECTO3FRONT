import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoTituloComponent } from '../../../components/logo-titulo/logo-titulo.component';
import { SignUpFormComponent } from '../../../components/auth/sign-up/sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, LogoTituloComponent, SignUpFormComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  constructor() {}
}
