export class Log {
    fecha: Date;
    usuario: string;

    constructor(
        fecha: Date,
        usuario: string,
    ) {
        this.fecha = fecha;
        this.usuario = usuario;
    }

    static constructorArr(arr: any[]): Log[] {
        return arr.map((e) => { return new Log(e.fecha, e.usuario); });
    }
}
