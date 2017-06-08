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

        let llavesApertura: string[] = codigoSinFormato.match(/\)(\s)*{/g);
        let codigoPreFormateadoPorLlavesApr: string = codigoSinFormato;
        codigoPreFormateadoPorLlavesApr = codigoPreFormateadoPorLlavesApr.replace(/\)(\s)*{/g, llavesApertura[0] + "\n");


        let llavesCierre: string[] = codigoPreFormateadoPorLlavesApr.match(/}(?!;+)/g)
        let codigoPreFormateadoPorLlavesCi: string = codigoPreFormateadoPorLlavesApr;
        codigoPreFormateadoPorLlavesCi = codigoPreFormateadoPorLlavesCi.replace(/}(?!;+)/g, ("\n" + llavesCierre[0]));


        let elses: string[] = codigoPreFormateadoPorLlavesCi.match(/else(\s)*{/g)
        let codigoPreFormateadoPorElses: string = codigoPreFormateadoPorLlavesCi;
        codigoPreFormateadoPorElses = codigoPreFormateadoPorElses.replace(/else(\s)*{/g, (elses[0] + "\n"));


        let fors: string[] = codigoPreFormateadoPorElses.match(/for(\s)*\((.)+\)(\s)*{/g)
        let forsFormateadosTemporal:string[] = [];
        fors.forEach(cadaFor => { forsFormateadosTemporal.push(cadaFor.replace(/;/g, ";¬")); });

        let iterableTemporal: number = 0;
        let codigoPreFormateadoPorFors: string = codigoPreFormateadoPorElses;
        fors.forEach(forPre => {
            codigoPreFormateadoPorFors = codigoPreFormateadoPorFors.replace(fors[iterableTemporal], forsFormateadosTemporal[iterableTemporal]);
            iterableTemporal++;
        });


        let codigoPreFormateadoPorSentencias: string = codigoPreFormateadoPorFors.replace(/;(?!¬+)/g, ";\n");
        codigoPreFormateadoPorSentencias = codigoPreFormateadoPorSentencias.replace("void loop", "\n\nvoid loop");
        codigoPreFormateadoPorSentencias = codigoPreFormateadoPorSentencias.replace("if", "\nif");


        let codigoPreFormateadoALineas: string[] = codigoPreFormateadoPorSentencias.split("\n");
        codigoPreFormateadoALineas.forEach(linea => {

            linea = linea.trim();

            if (linea != ""){

                if(linea.indexOf("{") > -1 && linea.indexOf(";") != linea.length -1){

                    if(this.elTextoContiene(["if", "else","for", "do", "while"], linea))
                        linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
                        this.nivelDeTabulacion ++;
                } else if(linea.indexOf("}") > -1 && linea.indexOf(";") != linea.length -1 /*|| linea.indexOf("}") > -1 && linea.indexOf("{") > -1*/){

                    this.nivelDeTabulacion --;
                    linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
                } else {

                    linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
                }

                linea = this.colorearPalabras(linea);
                this.codigoFormateado += linea + "\n";
            }
        });

        this.codigoFormateado = this.codigoFormateado.replace(/;¬/g, ";");
        this.miDiv.innerHTML += this.codigoFormateado;
    }


    devolverSangria(nivel: number): string {

        let sangria: string = "";

        for (let i = 1; i <= nivel; i++)
        sangria += "    "

        return sangria;
    }


    elTextoContiene(arrayDePalabras: string[], linea: string): boolean{

        let encontrado: boolean = false;

        arrayDePalabras.forEach(palabra => {
            if(linea.indexOf(palabra) > -1)
                encontrado = true;
        });

        return encontrado;
    }


    colorearPalabras(linea: string){

        let lineaColoreada: string = "";

        lineaColoreada = linea.replace(/(if)+/g, '<a style="color: #e71037">if</a>');
        lineaColoreada = lineaColoreada.replace(/(void)+/g, '<a style="color: #e71037">void</a>');
        lineaColoreada = lineaColoreada.replace(/(loop)+/g, '<a style="color: #22d013">loop</a>');
        lineaColoreada = lineaColoreada.replace(/(setup)+/g, '<a style="color: #22d013">setup</a>');

        return lineaColoreada;
    }
}
