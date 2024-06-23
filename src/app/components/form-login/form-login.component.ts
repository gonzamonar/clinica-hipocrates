import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatButtonModule } from '@angular/material/button'
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NotifierService } from '../../services/notifier.service';


@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    RouterModule,
    RouterOutlet
  ],
  templateUrl: './form-login.component.html',
  styleUrl: '../form-styles.css'
})

export class FormLoginComponent {
  email: string = '';
  password: string = '';
  rememberLogin: boolean = false;
  hide: boolean = true;
  loginError: boolean = false;
  errorMessage: string = '';
  verifyError: boolean = false;
  sendingRequest: boolean = false;

  constructor(
    public login: LoginService,
    public session: SessionService,
    private router: Router,
    private notifier: NotifierService
  ) { }

  async Login() {
    if (!this.sendingRequest){
      this.sendingRequest = true;
      this.loginError = false;
      this.verifyError = false;
      this.errorMessage = '';
  
      this.login.signIn(this.email, this.password, this.rememberLogin)
      .then((res) => {
          this.loginError = res;
          if (this.loginError){
            this.errorMessage = "Usuario o contraseña incorrectos.";
          } else {
            if (!this.session.getCurrentUser().emailVerified){
              this.verifyError = true;
              this.login.signOut();
            } else if (!this.session.isSessionAuthorized()) {
              this.loginError = true;
              this.errorMessage = "Un administrador debe habilitar su cuenta para ingresar.";
              this.login.signOut();
            } else {
              this.quickAccess('', '');
              this.notifier.popUpNotification('Bienvenido/a '+ this.session.data?.nombre);
              this.router.navigate(['/']);
            }
          }
        }
      ).then(() => {
        this.sendingRequest = false;
      });
    }
  }

  Logout() {
    this.login.requireSignOut();
  }

  quickAccess(email: string, pwd: string){
    this.loginError = false;
    this.verifyError = false;
    this.email = email;
    this.password = pwd;
  }
}
