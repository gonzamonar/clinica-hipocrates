import { Usuario } from "./usuario";

export class Especialista extends Usuario {
    especialidad: string;
    habilitado: boolean;

    constructor(
        nombre: string,
        apellido: string,
        edad: number,
        dni: number,
        email: string,
        imagenPerfil: string,
        nivelUsuario: string,
        especialidad: string,
        habilitado: boolean
    ) {
        super(nombre, apellido, edad, dni, email, imagenPerfil, nivelUsuario);
        this.especialidad = especialidad;    
        this.habilitado = habilitado; 
    }

    static constructorObj(obj: any): Especialista{
        return new Especialista(obj.nombre, obj.apellido, obj.edad, obj.dni, obj.email, obj.imagenPerfil, obj.nivelUsuario, obj.especialidad, obj.habilitado);
    }

    static constructorArr(arr: any[]): Especialista[] {
        return arr
                .filter((e) => { return e['nivelUsuario'] == 'especialista';})
                .map((e) => { return new Especialista(e.nombre, e.apellido, e.edad, e.dni, e.email, e.imagenPerfil, e.nivelUsuario, e.especialidad, e.habilitado); });
    }

    static filtrarHabilitados(arr: Especialista[]): Especialista[] {
        return arr.filter((e: Especialista) => { return e.habilitado });
    }

    static filtrarPorEspecialidad(arr: Especialista[], especialidad: string): Especialista[] {
        return arr.filter((e: Especialista) => {return e.especialidad == especialidad})
    }

    static filtrarPorEmails(arr: Especialista[], emails: string[]): Especialista[] {
        return arr.filter((e: Especialista) => {return emails.includes(e.email)});
    }

    static filtrarUno(arr: Especialista[], email: string): Especialista {
        return arr.filter((e: Especialista) => {return e.email == email})[0];
    }
    
    static getEspecialidades(arr: Especialista[]): string[] {
        return arr.map((e: Especialista) => { return e.especialidad });
    }
}
