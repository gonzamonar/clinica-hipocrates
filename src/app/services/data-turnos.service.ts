import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, getDocs, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { take } from 'rxjs';
import { Turno } from '../models/turno';
import { NotifierService } from './notifier.service';
import { Estado } from '../models/enums/estado';

@Injectable({
  providedIn: 'root'
})

export class DataTurnosService {
  private TABLE: string = 'turnos';
  private nextId: number = 0;

  constructor(
    private firestore: Firestore,
    private notifier: NotifierService
  ) {
    this.getNextId()
  }

  async pushOne(turno: Turno): Promise<boolean> {
    let success = false;
    let dataCollection = collection(this.firestore, this.TABLE);

    if (this.nextId != 0){
      let status = await addDoc(dataCollection, {
        'nro_turno': this.nextId,
        'estado': turno.estado,
        'especialista': turno.especialista,
        'especialidad': turno.especialidad,
        'paciente': turno.paciente,
        'dia': turno.dia,
        'hora': turno.hora,
        'comentario': turno.comentario,
        'review': turno.review,
        'nro_encuesta': turno.nro_encuesta,
        'calificacion': turno.calificacion,
      });
      
      if (status){
        success = true;
        this.nextId += 1;
      }
    }

    return success;
  }

  async cancelarTurno(turno: Turno, comentario: string): Promise<void> {
    if (comentario != ''){
      turno.comentario = comentario;
      this.updateStatus(turno, Estado.Cancelado);
    }
  }

  async aceptarTurno(turno: Turno): Promise<void> {
    this.updateStatus(turno, Estado.Aceptado);
  }

  async rechazarTurno(turno: Turno, comentario: string): Promise<void> {
    if (comentario != ''){
      turno.comentario = comentario;
      this.updateStatus(turno, Estado.Rechazado);
    }
  }

  async finalizarTurno(turno: Turno): Promise<void> {
    this.updateStatus(turno, Estado.Realizado);
  }

  async calificarTurno(turno: Turno, comentario: string, calificacion: number): Promise<void> {
    turno.comentario = comentario;
    turno.calificacion = calificacion;
    this.updateTurno(turno);
  }

  async agregarReviewTurno(turno: Turno, review: string): Promise<void> {
    turno.review = review;
    this.updateTurno(turno);
  }

  private async updateStatus(turno: Turno, estado: string): Promise<void> {
    let col = collection(this.firestore, this.TABLE);
    const fetchQuery = query(
      col, 
      where("nro_turno", "==", turno.nro_turno),
      limit(1),
    );

    const querySnapshot = await getDocs(fetchQuery);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        'estado': estado,
        'comentario': turno.comentario,
      });
      
      this.notifier.popUpNotification("Estado del turno actualizado exitosamente.")
    });
  }

  private async updateTurno(turno: Turno): Promise<void> {
    let col = collection(this.firestore, this.TABLE);
    const fetchQuery = query(
      col, 
      where("nro_turno", "==", turno.nro_turno),
      limit(1),
    );

    const querySnapshot = await getDocs(fetchQuery);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        'calificacion': turno.calificacion,
        'review': turno.review,
        'comentario': turno.comentario,
      });
    });
  }

  public async updateTurnoNroEncuesta(nro_turno: number, nro_encuesta: number): Promise<void> {
    let col = collection(this.firestore, this.TABLE);
    const fetchQuery = query(
      col, 
      where("nro_turno", "==", nro_turno),
      limit(1),
    );

    const querySnapshot = await getDocs(fetchQuery);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        'nro_encuesta': nro_encuesta,
      });
    });
  }

  public async updateTurnoNroHistoriaClinica(nro_turno: number, nro_historia_clinica: number): Promise<void> {
    let col = collection(this.firestore, this.TABLE);
    const fetchQuery = query(
      col, 
      where("nro_turno", "==", nro_turno),
      limit(1),
    );

    const querySnapshot = await getDocs(fetchQuery);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        'nro_historia_clinica': nro_historia_clinica,
      });
    });
  }

  fetchAll(){
    let col = collection(this.firestore, this.TABLE);
    const sortedQuery = query(
      col,
      orderBy('nro_turno', 'asc')
    );
    const observable = collectionData(sortedQuery);
    return observable;
  }

  private getNextId() {
    this.fetchAll().pipe(take(1)).subscribe(
      (response) => {
        if (response.length == 0) {
          this.nextId = 1;
        } else {
          this.nextId =  Math.max(...response.map((e: any) => { return parseInt(e.nro_turno) })) + 1;
        }
    });
  }
}
