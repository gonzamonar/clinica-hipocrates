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
import { DialogCancelComponent } from '../dialog-cancel/dialog-cancel.component';
import { take } from 'rxjs';

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
    DialogCancelComponent
  ],
  templateUrl: './card-turno.component.html',
  styleUrl: './card-turno.component.css'
})

export class CardTurnoComponent {
  @Input() turno!: Turno;
  @Input() nombrePaciente: string = '';
  @Input() nombreEspecialista: string = '';

  iconStar: IconDefinition = faStar;

  constructor(
    private session: SessionService
  ){ }
  
  displayTooltipCalificacion(calificacion: number | null){
    return calificacion == null ? "Calificación pendiente" : "Calificación del usuario" ;
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

  getStatusIcon(status: string){
    let icon: IconDefinition = faHourglass; //pendiente
    switch (status){
      case "Cancelado":
        icon = faXmark;
        break;
      case "Rechazado":
        icon = faBan;
        break;
      case "Aceptado":
        icon = faCircleCheck;
        break;
      case "Realizado":
        icon = faFlagCheckered;
        break;
    }
    return icon;
  }

  getStatusBgColor(status: string){
    let color: string = '#673ab7';
    switch (status){
      case "Pendiente":
        color = '#f18695';
        break;
      case "Cancelado":
        color = '#e63200';
        break;
      case "Rechazado":
        color = '#a60000';
        break;
      case "Aceptado":
        color = '#3ca80e';
        break;
      case "Realizado":
        color = '#673ab7';
        break;
    }
    return color;
  }


  displayCancelBtn(turno: Turno): boolean {
    return (this.session.isPatientLevelSession() && turno.estado == 'Pendiente')
        || (this.session.isSpecialistLevelSession() && turno.estado == 'Pendiente')
        || (this.session.isAdminLevelSession() && turno.estado == 'Pendiente');
  }

  displayRejectBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.estado == 'Pendiente');
  }

  displayAcceptBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.estado == 'Pendiente');
  }

  displayFinishBtn(turno: Turno): boolean {
    return (this.session.isSpecialistLevelSession() && turno.estado == 'Aceptado');
  }

  displayCompleteQuizBtn(turno: Turno): boolean {
    return (this.session.isPatientLevelSession() && turno.review != null && turno.estado == 'Realizado');
  }

  displayCalificationBtn(turno: Turno): boolean {
    return (this.session.isPatientLevelSession() && turno.estado == 'Realizado');
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    let result = false;
    const dialogRef = this.dialog.open(DialogCancelComponent);
    return dialogRef;
  }

  actionAcceptBtn() {
    
  }

  actionCancelBtn() {
    this.openDialog().afterClosed()
    .pipe(take(1))
    .subscribe((res) => {
      if(res === true){
        alert("CANCELADO");
      }
    });
  }

  actionRejectBtn() {

  }

  actionFinishBtn() {

  }

  actionCompleteQuizBtn() {

  }

  actionCalificationBtn() {

  }

}
