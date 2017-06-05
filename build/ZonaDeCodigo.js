"use strict";
var ZonaDeCodigo = (function () {
    function ZonaDeCodigo() {
        this.codigoSinFormato = "";
        this.codigoFormateado = "";
        this.tabulador = "\t";
        this.nivelDeTabulacion = 0;
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
            codigoPreFormateado += palabra;
        });
        lineas = codigoPreFormateado.split("\n");
        lineas.forEach(function (linea) {
            if (linea.indexOf("{"))
                _this.nivelDeTabulacion++;
            else if (linea.indexOf("}"))
                _this.nivelDeTabulacion--;
            _this.codigoFormateado += "\n" + Array(_this.nivelDeTabulacion).join("\t") + linea;
        });
        this.miDiv.innerHTML = this.codigoFormateado;
    };
    return ZonaDeCodigo;
}());
