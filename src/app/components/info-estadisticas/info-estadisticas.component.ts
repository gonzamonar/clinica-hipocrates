import { Component, OnInit } from '@angular/core';
import { DataTurnosService } from '../../services/data-turnos.service';
import { CommonModule } from '@angular/common';
import { Turno } from '../../models/turno';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Especialista } from '../../models/especialista';

@Component({
  selector: 'app-info-estadisticas',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './info-estadisticas.component.html',
  styleUrl: './info-estadisticas.component.css'
})

export class InfoEstadisticasComponent implements OnInit {
  turnos!: Turno[];
  especialidades!: string[];
  especialistas!: Especialista[];
  emailsEspecialistas!: string[];
  dias!: string[];

  constructor(
    private providerDataTurnos: DataTurnosService,
    private providerDataUsuarios: DataUsuariosService,
  ){}

  ngOnInit() {
    this.providerDataTurnos.fetchAll().subscribe(
      (res) => {
        this.turnos = Turno.constructorArr(res);
        this.especialidades = Turno.getEspecialidades(Turno.ordenarPorEspecialidad(this.turnos));
        this.emailsEspecialistas = Turno.getEspecialistas(Turno.ordenarPorEspecialista(this.turnos));
        this.dias = Turno.getDias(Turno.ordenarPorFecha(this.turnos));
    });

    this.providerDataUsuarios.fetchAll().subscribe(
      (res) => {
        this.especialistas = Especialista.filtrarPorEmails(Especialista.constructorArr(res), this.emailsEspecialistas);
    });
  }

  cantidadTurnosEspecialidades(especialidad: string){
    return Turno.contarPorEspecialidad(this.turnos, especialidad);
  }

  cantidadTurnosDias(dia: string){
    return Turno.contarPorDia(this.turnos, dia);
  }

  cantidadTurnosSolicitadosEspecialistas(especialista: string){
    return Turno.contarPorNoEstado(Turno.filtrarPorEspecialista(this.turnos, especialista), 'Finalizado');
  }
  
  cantidadTurnosFinalizadosEspecialistas(especialista: string){
    return Turno.contarPorEstado(Turno.filtrarPorEspecialista(this.turnos, especialista), 'Finalizado');
  }
}
