import { Component } from '@angular/core';
import { FormgroupAltaUsuariosComponent } from '../../components/formgroup-alta-usuarios/formgroup-alta-usuarios.component';
import { ListadoUsuariosComponent } from '../../components/listado-usuarios/listado-usuarios.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormgroupAltaUsuariosComponent,
    ListadoUsuariosComponent,
    MatTabsModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent {

  constructor(
    public session: SessionService,
  ) { }
}
