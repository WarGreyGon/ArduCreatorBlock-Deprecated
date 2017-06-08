"use strict";
var ZonaDeCodigo = (function () {
    function ZonaDeCodigo() {
        this.codigoSinFormato = "";
        this.codigoFormateado = "";
        this.tabulador = "\t";
        this.nivelDeTabulacion = 0;
        this.palabrasReservadas = ["if", "else", "do", "while", "for"];
        this.miDiv = $('.ContenedorDeTexto').get(0);
    }
    ZonaDeCodigo.prototype.establecerCodigoAFormatear = function (codigoSinFormato) {
        var _this = this;
        var llavesApertura = codigoSinFormato.match(/\)(\s)*{/g);
        var codigoPreFormateadoPorLlavesApr = codigoSinFormato;
        codigoPreFormateadoPorLlavesApr = codigoPreFormateadoPorLlavesApr.replace(/\)(\s)*{/g, llavesApertura[0] + "\n");
        var llavesCierre = codigoPreFormateadoPorLlavesApr.match(/}(?!;+)/g);
        var codigoPreFormateadoPorLlavesCi = codigoPreFormateadoPorLlavesApr;
        codigoPreFormateadoPorLlavesCi = codigoPreFormateadoPorLlavesCi.replace(/}(?!;+)/g, ("\n" + llavesCierre[0]));
        var elses = codigoPreFormateadoPorLlavesCi.match(/else(\s)*{/g);
        var codigoPreFormateadoPorElses = codigoPreFormateadoPorLlavesCi;
        codigoPreFormateadoPorElses = codigoPreFormateadoPorElses.replace(/else(\s)*{/g, (elses[0] + "\n"));
        var codigoPreFormateadoALineas = codigoPreFormateadoPorElses.split("\n");
        codigoPreFormateadoALineas.forEach(function (linea) {
            linea = linea.trim();
            // if(linea.indexOf("{") > -1){
            //
            //     if(this.elTextoContiene(["if", "for", "do", "while"], linea))
            //         linea = "\n" + this.devolverSangria(this.nivelDeTabulacion) + linea;
            //     else
            //         linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
            //
            //     this.nivelDeTabulacion ++;
            // } else if(linea.indexOf("}") > -1){
            //
            //     this.nivelDeTabulacion --;
            //     linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
            // } else {
            //
            //     linea = this.devolverSangria(this.nivelDeTabulacion) + linea;
            // }
            // linea = this.colorearPalabras(linea);
            _this.codigoFormateado += linea + "\n";
        });
        this.miDiv.innerHTML += this.codigoFormateado;
    };
    ZonaDeCodigo.prototype.devolverSangria = function (nivel) {
        var sangria = "";
        for (var i = 0; i < nivel; i++)
            sangria += "    ";
        return sangria;
    };
    ZonaDeCodigo.prototype.elTextoContiene = function (arrayDePalabras, linea) {
        var encontrado = false;
        arrayDePalabras.forEach(function (palabra) {
            if (linea.indexOf(palabra) > -1)
                encontrado = true;
            console.log(linea + " ==> " + palabra + ": " + encontrado);
        });
        return encontrado;
    };
    ZonaDeCodigo.prototype.colorearPalabras = function (linea) {
        var lineaColoreada = "";
        lineaColoreada = linea.replace(/(if)+/g, '<a style="color: #e71037">if</a>');
        lineaColoreada = lineaColoreada.replace(/(void)+/g, '<a style="color: #e71037">void</a>');
        lineaColoreada = lineaColoreada.replace(/(loop)+/g, '<a style="color: #22d013">loop</a>');
        return lineaColoreada;
    };
    return ZonaDeCodigo;
}());
