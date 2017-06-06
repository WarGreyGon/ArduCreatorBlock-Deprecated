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
        var lineas = [];
        var codigoSpliteado = codigoSinFormato.split(" ");
        var codigoPreFormateado = "";
        codigoSpliteado.forEach(function (palabra) {
            if (['{', '}', ';'].indexOf(palabra) > -1 || palabra.indexOf(';') > -1)
                palabra = palabra + "\n";
            else
                palabra = palabra + " ";
            codigoPreFormateado += palabra;
        });
        lineas = codigoPreFormateado.split("\n");
        lineas.forEach(function (linea) {
            if (linea.indexOf("{") > -1) {
                if (_this.elTextoContiene(["if", "for", "do", "while"], linea))
                    linea = "\n" + _this.devolverSangria(_this.nivelDeTabulacion) + linea;
                else
                    linea = _this.devolverSangria(_this.nivelDeTabulacion) + linea;
                _this.nivelDeTabulacion++;
            }
            else if (linea.indexOf("}") > -1) {
                _this.nivelDeTabulacion--;
                linea = _this.devolverSangria(_this.nivelDeTabulacion) + linea;
            }
            else {
                linea = _this.devolverSangria(_this.nivelDeTabulacion) + linea;
            }
            linea = _this.colorearPalabras(linea);
            _this.codigoFormateado += linea + "\n";
        });
        this.miDiv.innerHTML = this.codigoFormateado;
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
