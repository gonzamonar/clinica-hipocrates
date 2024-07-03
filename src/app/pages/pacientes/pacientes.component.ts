import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ListadoHistoriaClinicaComponent } from '../../components/listado-historia-clinica/listado-historia-clinica.component';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ListadoHistoriaClinicaComponent,
  ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent {

  constructor(
    public session: SessionService,
  ) { }
}
