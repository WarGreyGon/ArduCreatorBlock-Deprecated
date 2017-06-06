class ZonaDeCodigo {

    miDiv: HTMLElement;
    codigoSinFormato: string = "";
    codigoFormateado: string = "";

    tabulador: string = "\t";
    nivelDeTabulacion: number = 0;

    palabrasReservadas: string[] = ["if", "else", "do", "while", "for"];




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
            else
                palabra = palabra + " ";

            codigoPreFormateado += palabra;
        });

        lineas = codigoPreFormateado.split("\n");

        lineas.forEach(linea => {

            if(linea.indexOf("{") > -1){

                if(this.elTextoContiene(["if", "for", "do", "while"], linea))
                    linea = "\n" + this.devolverSangria(this.nivelDeTabulacion) + linea;
                else
                    linea = this.devolverSangria(this.nivelDeTabulacion) + linea;

                this.nivelDeTabulacion ++;
            } else if(linea.indexOf("}") > -1){

                this.nivelDeTabulacion --;
                linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
            } else {

                linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
            }

            linea = this.colorearPalabras(linea);
            this.codigoFormateado += linea + "\n";
        });

        this.miDiv.innerHTML = this.codigoFormateado;
    }


    devolverSangria(nivel: number): string {

        let sangria: string = "";

        for (let i=0; i<nivel; i++)
            sangria += "    "

        return sangria;
    }


    elTextoContiene(arrayDePalabras: string[], linea: string): boolean{

        let encontrado: boolean = false;

        arrayDePalabras.forEach(palabra => {
            if(linea.indexOf(palabra) > -1)
                encontrado = true;
            console.log(linea + " ==> " + palabra + ": " + encontrado)
        });

        return encontrado;
    }


    colorearPalabras(linea: string){

        let lineaColoreada: string = "";

        lineaColoreada = linea.replace(/(if)+/g, '<a style="color: #e71037">if</a>');
        lineaColoreada = lineaColoreada.replace(/(void)+/g, '<a style="color: #e71037">void</a>');
        lineaColoreada = lineaColoreada.replace(/(loop)+/g, '<a style="color: #22d013">loop</a>');

        return lineaColoreada;
    }
}
