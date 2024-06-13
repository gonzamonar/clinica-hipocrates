import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IconDefinition, faHouseMedical, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    FontAwesomeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  homeIcon: IconDefinition = faHouseMedical;
}
