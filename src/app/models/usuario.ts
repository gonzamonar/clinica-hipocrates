export class Usuario {
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    imagenPerfil: string;
    nivelUsuario: string;


    constructor (
        nombre: string,
        apellido: string,
        edad: number,
        dni: number,
        email: string,
        imagenPerfil: string,
        nivelUsuario: string
    ) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.email = email;
        this.imagenPerfil = imagenPerfil;
        this.nivelUsuario = nivelUsuario;
    }

    fullName(): string{
        return this.nombre + " " + this.apellido;
    }

    includes(str: string): boolean {
        let searchStr: string = str.toLocaleLowerCase();
        return this.fullName().toLocaleLowerCase().includes(searchStr);
    }

    static constructorArr(arr: any[]): Usuario[] {
        return arr
            .map((e) => { return new Usuario(e.nombre, e.apellido, e.edad, e.dni, e.email, e.imagenPerfil, e.nivelUsuario); });
    }

    static filtrarUno(arr: Usuario[], email: string): Usuario {
        return arr.filter((i) => {return i.email == email})[0];
    }

    static getUserFullName(arr: Usuario[], email: string): string {
        return this.filtrarUno(arr, email).fullName();
    }
}
