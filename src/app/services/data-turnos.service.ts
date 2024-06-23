import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Turno } from '../models/turno';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTurnosService {
  private TABLE: string = 'turnos';
  private nextId: number = 0;

  constructor(
    private firestore: Firestore
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
