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
        var fors = codigoPreFormateadoPorElses.match(/for(\s)*\((.)+\)(\s)*{/g);
        var forsFormateadosTemporal = [];
        fors.forEach(function (cadaFor) { forsFormateadosTemporal.push(cadaFor.replace(/;/g, ";¬")); });
        var iterableTemporal = 0;
        var codigoPreFormateadoPorFors = codigoPreFormateadoPorElses;
        fors.forEach(function (forPre) {
            codigoPreFormateadoPorFors = codigoPreFormateadoPorFors.replace(fors[iterableTemporal], forsFormateadosTemporal[iterableTemporal]);
            iterableTemporal++;
        });
        var codigoPreFormateadoPorSentencias = codigoPreFormateadoPorFors.replace(/;(?!¬+)/g, ";\n");
        codigoPreFormateadoPorSentencias = codigoPreFormateadoPorSentencias.replace("void loop", "\n\nvoid loop");
        codigoPreFormateadoPorSentencias = codigoPreFormateadoPorSentencias.replace("if", "\nif");
        var codigoPreFormateadoALineas = codigoPreFormateadoPorSentencias.split("\n");
        codigoPreFormateadoALineas.forEach(function (linea) {
            linea = linea.trim();
            if (linea != "") {
                if (linea.indexOf("{") > -1 && linea.indexOf(";") != linea.length - 1) {
                    if (_this.elTextoContiene(["if", "else", "for", "do", "while"], linea))
                        linea = _this.devolverSangria(_this.nivelDeTabulacion) + linea;
                    _this.nivelDeTabulacion++;
                }
                else if (linea.indexOf("}") > -1 && linea.indexOf(";") != linea.length - 1 /*|| linea.indexOf("}") > -1 && linea.indexOf("{") > -1*/) {
                    _this.nivelDeTabulacion--;
                    linea = _this.devolverSangria(_this.nivelDeTabulacion) + linea;
                }
                else {
                    linea = _this.devolverSangria(_this.nivelDeTabulacion) + linea;
                }
                linea = _this.colorearPalabras(linea);
                _this.codigoFormateado += linea + "\n";
            }
        });
        this.codigoFormateado = this.codigoFormateado.replace(/;¬/g, ";");
        this.miDiv.innerHTML += this.codigoFormateado;
    };
    ZonaDeCodigo.prototype.devolverSangria = function (nivel) {
        var sangria = "";
        for (var i = 1; i <= nivel; i++)
            sangria += "    ";
        return sangria;
    };
    ZonaDeCodigo.prototype.elTextoContiene = function (arrayDePalabras, linea) {
        var encontrado = false;
        arrayDePalabras.forEach(function (palabra) {
            if (linea.indexOf(palabra) > -1)
                encontrado = true;
        });
        return encontrado;
    };
    ZonaDeCodigo.prototype.colorearPalabras = function (linea) {
        var lineaColoreada = "";
        lineaColoreada = linea.replace(/(if)+/g, '<a style="color: #e71037">if</a>');
        lineaColoreada = lineaColoreada.replace(/(void)+/g, '<a style="color: #e71037">void</a>');
        lineaColoreada = lineaColoreada.replace(/(loop)+/g, '<a style="color: #22d013">loop</a>');
        lineaColoreada = lineaColoreada.replace(/(setup)+/g, '<a style="color: #22d013">setup</a>');
        return lineaColoreada;
    };
    return ZonaDeCodigo;
}());
