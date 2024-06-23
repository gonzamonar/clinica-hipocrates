import { Component, OnInit } from '@angular/core';
import { DataTurnosService } from '../../services/data-turnos.service';
import { Turno } from '../../models/turno';
import { CommonModule } from '@angular/common';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Especialista } from '../../models/especialista';
import { Paciente } from '../../models/paciente';
import { CardTurnoComponent } from '../card-turno/card-turno.component';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-listado-turnos',
  standalone: true,
  imports: [
    CommonModule,
    CardTurnoComponent
  ],
  templateUrl: './listado-turnos.component.html',
  styleUrl: './listado-turnos.component.css'
})

export class ListadoTurnosComponent implements OnInit {
  turnos!: Turno[];
  especialistas!: Especialista[];
  pacientes!: Paciente[];

  constructor(
    public providerDataTurnos: DataTurnosService,
    public providerDataUsuarios: DataUsuariosService,
    public session: SessionService
  ){ }

  ngOnInit() {
    this.providerDataUsuarios.fetchAll().subscribe(
      (res) => {
        if (res != null){
          this.especialistas = Especialista.constructorArr(res);
          this.pacientes = Paciente.constructorArr(res);
        }
    });

    this.providerDataTurnos.fetchAll().subscribe(
      (res) => {
        this.turnos = Turno.constructorArr(res);
        
        if (this.session.isPatientLevelSession() && this.session.data != null){
          this.turnos = Turno.filtrarPorPaciente(this.turnos, this.session.data?.email);
        }

        if (this.session.isSpecialistLevelSession() && this.session.data != null){
          this.turnos = Turno.filtrarPorEspecialista(this.turnos, this.session.data?.email);
        }
    });
  }

  displayNamePaciente(email: string){
    return this.pacientes ? Paciente.filtrarUno(this.pacientes, email).fullName() : email;
  }

  displayNameEspecialista(email: string){
    return this.especialistas ? Especialista.filtrarUno(this.especialistas, email).fullName() : email;
  }

  cancelarTurno(turno: Turno){
    // let dialogRef = dialog.open(UserProfileComponent, {
    //   height: '400px',
    //   width: '600px',
    // });
  }
}
