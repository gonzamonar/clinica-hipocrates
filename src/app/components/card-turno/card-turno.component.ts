import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from '../../services/session.service';
import { IconDefinition, faBan, faCircleCheck, faFlagCheckered, faHourglass, faStar, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RenderNullStringFieldPipe } from '../../pipes/render-null-string-field.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Turno } from '../../models/turno';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogCancelComponent } from '../modals/dialog-cancel/dialog-cancel.component';
import { take } from 'rxjs';
import { NotifierService } from '../../services/notifier.service';
import { Estado } from '../../models/enums/estado';
import { ColorEstado } from '../../models/enums/color-estado';
import { DataTurnosService } from '../../services/data-turnos.service';
import { DialogComentarioTurnoComponent } from '../modals/dialog-comentario-turno/dialog-comentario-turno.component';
import { Usuario } from '../../models/usuario';
import { DialogAceptarTurnoComponent } from '../modals/dialog-aceptar-turno/dialog-aceptar-turno.component';
import { DialogRechazarTurnoComponent } from '../modals/dialog-rechazar-turno/dialog-rechazar-turno.component';
import { DialogFinalizarTurnoComponent } from '../modals/dialog-finalizar-turno/dialog-finalizar-turno.component';
import { DialogCalificarTurnoComponent } from '../modals/dialog-calificar-turno/dialog-calificar-turno.component';
import { DialogCargarReviewComponent } from '../modals/dialog-cargar-review/dialog-cargar-review.component';
import { DialogCargarHistoriaClinicaComponent } from '../modals/dialog-cargar-historia-clinica/dialog-cargar-historia-clinica.component';
import { DataHistoriaClinicaService } from '../../services/data-historia-clinica.service';
import { HistoriaClinica } from '../../models/historia-clinica';
import { DatoDinamico } from '../../models/dato-dinamico';
import { MatChipsModule } from '@angular/material/chips';
import { ToTitleCasePipe } from '../../pipes/to-title-case.pipe';

@Component({
  selector: 'app-card-turno',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    FontAwesomeModule,
    RenderNullStringFieldPipe,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    ToTitleCasePipe
  ],
  templateUrl: './card-turno.component.html',
  styleUrl: './card-turno.component.css'
})

export class CardTurnoComponent {
  @Input() turno!: Turno;
  @Input() historiaClinica: HistoriaClinica | null = null;
  @Input() listaUsuarios: Usuario[] = [];
  readonly dialog = inject(MatDialog);
  iconStar: IconDefinition = faStar;

  constructor(
    private session: SessionService,
    private notifier: NotifierService,
    private providerDataTurnos: DataTurnosService,
    private providerDataHistoriaClinica: DataHistoriaClinicaService
  ){ }
  
  displayTooltipCalificacion(calificacion: number | null){
    return calificacion == null ? "Calificación pendiente" : "Calificación del paciente" ;
  }

  displayTooltipComentario(comentario: string | null){
    return comentario == null ? "Todavía no se han agregado comentarios." : "Ver Comentarios" ;
  }

  displayTooltipReview(review: string | null){
    return review == null ? "Todavía no se ha agregado una reseña." : "Ver Reseña del Especialista" ;
  }

  displayTooltipEncuesta(encuesta: number | null){
    return encuesta == null ? "La encuesta aún no ha sido realizada." : "Ver Encuesta realizada por el Paciente" ;
  }

  getNombreUsuario(usuario: string){
    let fullName = '';
    if (usuario != undefined && usuario != null && this.listaUsuarios != undefined){
      fullName = Usuario.filtrarUno(this.listaUsuarios, usuario).fullName();
    }
    return fullName;
  }

  getStatusIcon(status: string){
    let icon: IconDefinition = faHourglass; //pendiente
    switch (status){
      case Estado.Cancelado:
        icon = faXmark;
        break;
      case Estado.Rechazado:
        icon = faBan;
        break;
      case Estado.Aceptado:
        icon = faCircleCheck;
        break;
      case Estado.Realizado:
        icon = faFlagCheckered;
        break;
    }
    return icon;
  }

  getStatusBgColor(status: string){
    let color: string = ColorEstado.Pendiente;
    switch (status){
      case Estado.Pendiente:
        color = ColorEstado.Pendiente;
        break;
      case Estado.Cancelado:
        color = ColorEstado.Cancelado;
        break;
      case Estado.Rechazado:
        color = ColorEstado.Rechazado;
        break;
      case Estado.Aceptado:
        color = ColorEstado.Aceptado;
        break;
      case Estado.Realizado:
        color = ColorEstado.Realizado;
        break;
    }
    return color;
  }


  displayCancelBtn(turno: Turno): boolean {
    return (this.session.isPatientLevelSession() && turno.estado == Estado.Pendiente)
        || (this.session.isSpecialistLevelSession() && turno.estado == Estado.Pendiente)
        || (this.session.isAdminLevelSession() && turno.estado == Estado.Pendiente);
  }

  displayRejectBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.estado == Estado.Pendiente);
  }

  displayAcceptBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.estado == Estado.Pendiente);
  }

  displayFinishBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.estado == Estado.Aceptado);
  }

  displayCompleteQuizBtn(turno: Turno): boolean {
    return (this.session.isPatientLevelSession() && turno.review != null && turno.estado == Estado.Realizado);
  }

  displayCalificationBtn(turno: Turno): boolean {
    return (this.session.isPatientLevelSession() && turno.estado == Estado.Realizado && turno.calificacion == null);
  }

  displayCompleteReviewBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.review == null && turno.estado == Estado.Realizado);
  }

  displayUpdateClinicHistoryBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.nro_historia_clinica == null && turno.estado == Estado.Realizado);
  }

  displayShowReviewBtn(turno: Turno): boolean {
    return !(turno.estado == Estado.Cancelado || turno.estado == Estado.Rechazado);
  }

  displayShowEncuestaBtn(turno: Turno): boolean {
    return !(turno.estado == Estado.Cancelado || turno.estado == Estado.Rechazado);
  }

  showComment(comentario: string | null){
    if (comentario != null && comentario != undefined){
      let comentador = Usuario.filtrarUno(this.listaUsuarios, comentario.split(" -- ", 2)[0]);
      this.dialog.open(DialogComentarioTurnoComponent,
        { data : {
          usuario: comentador.fullName(),
          tipo: comentador.nivelUsuario,
          foto: comentador.imagenPerfil,
          comentario: comentario.split(" -- ", 2)[1],
        }}
      );
    }
  }

  showReview(review: string | null){
    if (review != null && review != undefined){
      let comentador = Usuario.filtrarUno(this.listaUsuarios, review.split(" -- ", 2)[0]);
      this.dialog.open(DialogComentarioTurnoComponent,
        { data : {
          usuario: comentador.fullName(),
          tipo: comentador.nivelUsuario,
          foto: comentador.imagenPerfil,
          comentario: review.split(" -- ", 2)[1],
        }}
      );
    }
  }

  actionAcceptBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogAceptarTurnoComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((res) => {
      if (res === true) {
        this.providerDataTurnos.aceptarTurno(turno);
      }
    });
  }

  actionCancelBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogCancelComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((comentario) => {
      if(comentario != undefined){
        if (comentario != ''){
          this.providerDataTurnos.cancelarTurno(turno, this.session.data?.email + " -- Motivo de cancelación: " + comentario);
        } else {
          this.notifier.alert("El comentario es obligatorio", "Debe agregar un comentario a la cancelación", "error");
        }
      }
    });
  }

  actionRejectBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogRechazarTurnoComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((comentario) => {
      if(comentario != undefined){
        if (comentario != ''){
          this.providerDataTurnos.rechazarTurno(turno, this.session.data?.email + " -- Motivo de rechazo: " + comentario);
        } else {
          this.notifier.alert("El comentario es obligatorio", "Debe agregar un comentario al rechazo del turno", "error");
        }
      }
    });
  }

  actionFinishBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogFinalizarTurnoComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((res) => {
      if (res === true) {
        this.providerDataTurnos.finalizarTurno(turno);
      }
    });
  }

  actionCalificationBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogCalificarTurnoComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((result) => {
      if (result.comentario != '' && result.rating != 0) {
        this.providerDataTurnos.calificarTurno(turno, this.session.data?.email + " -- Comentario de calificación: " + result.comentario, parseInt(result.rating));
      }
    });
  }

  actionCompleteReviewBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogCargarReviewComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((review) => {
      if(review != undefined){
        if (review != ''){
          this.providerDataTurnos.agregarReviewTurno(turno, this.session.data?.email + " -- Reseña del turno: " + review);
        }
      }
    });
  }

  actionCompleteQuizBtn(turno: Turno) {

  }

  actionUpdateClinicHistoryBtn(turno: Turno) {
    const dialogRef = this.dialog.open(DialogCargarHistoriaClinicaComponent);

    dialogRef.afterClosed()
    .pipe(take(1))
    .subscribe((response) => {
      if (response){
        let dato1 = response.dato1clave != '' && response.dato1valor != '' ? new DatoDinamico(response.dato1clave, response.dato1valor) : null ;
        let dato2 = response.dato2clave != '' && response.dato2valor != '' ? new DatoDinamico(response.dato2clave, response.dato2valor) : null ;
        let dato3 = response.dato3clave != '' && response.dato3valor != '' ? new DatoDinamico(response.dato3clave, response.dato3valor) : null ;
  
        let historia = new HistoriaClinica(
          0,
          turno.nro_turno,
          turno.paciente,
          turno.especialista,
          parseInt(response.altura),
          parseInt(response.peso),
          parseInt(response.temperatura),
          parseInt(response.presion),
          dato1,
          dato2,
          dato3
        );
        
        if (historia){
          this.providerDataHistoriaClinica.pushOne(historia);
        }
      }
    });
  }

}
