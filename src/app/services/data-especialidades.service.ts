import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, orderBy, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class DataEspecialidadesService {

  public dataCollection: any[] = [];

  constructor(
    private firestore: Firestore
  ) {
    this.fetchAll();
  }

  async pushOne(especialidad: string): Promise<boolean> {
    let mappedEspecialidades = this.dataCollection.map((e) => { return e.especialidad; });
    let success = false;

    if (!mappedEspecialidades.includes(especialidad)) {
      let dataCollection = collection(this.firestore, 'especialidades');
      
      let status = await addDoc(dataCollection, {
        'especialidad': especialidad,
        'urlImagen': "general.png",
      });
      
      if (status){
        success = true;
      }
    }
    return success;
  }
  
  fetchAll(){
    let col = collection(this.firestore, 'especialidades');
    const sortedQuery = query(
      col,
      orderBy('especialidad', 'asc')
    );
    const observable = collectionData(sortedQuery);

    observable.subscribe((response) => {
      this.dataCollection = response;
    });
  }
}
