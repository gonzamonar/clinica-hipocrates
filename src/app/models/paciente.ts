import { Usuario } from "./usuario";

export class Paciente extends Usuario {
    obraSocial: string;
    imagenPerfilAlt: string;

    constructor(
        nombre: string,
        apellido: string,
        edad: number,
        dni: number,
        email: string,
        imagenPerfil: string,
        nivelUsuario: string,
        obraSocial: string,
        imagenPerfilAlt: string
    ) {
        super(nombre, apellido, edad, dni, email, imagenPerfil, nivelUsuario);
        this.obraSocial = obraSocial;
        this.imagenPerfilAlt = imagenPerfilAlt;       
    }

    static override constructorArr(arr: any[]): Paciente[] {
        return arr
            .filter((e) => { return e['nivelUsuario'] == 'paciente';})
            .map((e) => { return new Paciente(e.nombre, e.apellido, e.edad, e.dni, e.email, e.imagenPerfil, e.nivelUsuario, e.obraSocial, e.imagenPerfilAlt); });
    }

    static override filtrarUno(arr: Paciente[], email: string): Paciente {
        return arr.filter((i) => {return i.email == email})[0];
    }
}
