import { Component } from '@angular/core';
import { DataEspecialidadesService } from '../../services/data-especialidades.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Usuario } from '../../models/usuario';
import { Especialista } from '../../models/especialista';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent {
  assetsDir: string = '/assets/img/especialidades/';
  dataEspecialidades!: any[];

  constructor (
    private dataProviderEspecialidades: DataEspecialidadesService,
    private dataProviderUsuarios: DataUsuariosService
  ){
    dataProviderUsuarios.fetchAll().subscribe(
      (res) => {
        if (res){
          let especialidades = Especialista.getEspecialidades(Especialista.filtrarHabilitados(Especialista.constructorArr(res)));
          especialidades = [...new Set(especialidades)];
          this.dataEspecialidades = dataProviderEspecialidades.dataCollection.filter((i) => { return especialidades.includes(i.especialidad) });
        }
    });
  }
}
