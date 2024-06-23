import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { SessionService } from './services/session.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  activeSessionForbiddenRoutes: string[] = ['/login', '/registro', '/verificar-email'];

  constructor(
    public auth: Auth,
    public session: SessionService,
    public router: Router
  ){
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if (this.auth.currentUser){
          this.session.updateSession(this.auth.currentUser);
          // if (this.activeSessionForbiddenRoutes.includes(this.router.url)){
          //   this.router.navigateByUrl('/');
          // }
        }
      } else {
        this.session.closeSession();
      }
    });
  }
}
