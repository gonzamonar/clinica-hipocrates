import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormAltaPacienteComponent } from '../form-alta-paciente/form-alta-paciente.component';
import { FormAltaEspecialistaComponent } from '../form-alta-especialista/form-alta-especialista.component';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [
    MatTabsModule,
    FormAltaPacienteComponent,
    FormAltaEspecialistaComponent
  ],
  templateUrl: './form-register.component.html',
  styleUrl: '../form-styles.css'
})
export class FormRegisterComponent {

}
