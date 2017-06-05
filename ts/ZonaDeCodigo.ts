class ZonaDeCodigo {

    miDiv: HTMLElement;
    codigoSinFormato: string = "";
    codigoFormateado: string = "";

    tabulador: string = "\t";
    nivelDeTabulacion: number = 0;




    constructor() {

        this.miDiv = $('.ContenedorDeTexto').get(0);
    }


    establecerCodigoAFormatear(codigoSinFormato: string): void {
        
        let lineas: string[] = [];

        let codigoSpliteado: string[] = codigoSinFormato.split(" ");
        let codigoPreFormateado: string = "";

        codigoSpliteado.forEach(palabra => {

            if(['{', '}', ';'].indexOf(palabra) > -1 || palabra.indexOf(';') > -1)
                palabra = palabra + "\n";

            codigoPreFormateado += palabra;
        });

        lineas = codigoPreFormateado.split("\n");

        lineas.forEach(linea => {

            if(linea.indexOf("{"))
                this.nivelDeTabulacion++;
            else if(linea.indexOf("}"))
                this.nivelDeTabulacion--;

            this.codigoFormateado += "\n" + Array(this.nivelDeTabulacion).join("\t") + linea;
        });

        this.miDiv.innerHTML = this.codigoFormateado;
    }
}
