"use strict";
var ZonaDeAcople = (function () {
    function ZonaDeAcople(bloqueContenedor, positionRespetoAlContenedor) {
        this.ACOPLE_HEMBRA = 'acopleHembra';
        this.ACOPLE_INTERNO = 'acopleInterno';
        this.ACOPLE_BAJO = 'acopleBajo';
        if (positionRespetoAlContenedor != this.ACOPLE_HEMBRA) {
            this.acopleMacho = document.createElement("div");
            this.acopleMacho.className = 'ZonaDeAcople Macho';
            $(bloqueContenedor.miDiv).append(this.acopleMacho);
            this.miDiv = this.acopleMacho;
            this.bloqueContenedor = bloqueContenedor;
        }
        else {
            this.acopleHembra = document.createElement("div");
            this.acopleHembra.className = 'ZonaDeAcople Hembra';
            $(bloqueContenedor.miDiv).append(this.acopleHembra);
            this.miDiv = this.acopleHembra;
            this.bloqueContenedor = bloqueContenedor;
        }
        switch (positionRespetoAlContenedor) {
            case this.ACOPLE_HEMBRA:
                $(this.acopleHembra).css({
                    'top': $(bloqueContenedor.miDiv).position().top
                });
                break;
            case this.ACOPLE_INTERNO:
                $(this.acopleMacho).css({
                    'top': $(bloqueContenedor.miDiv).position().top + $(bloqueContenedor.miDiv).height() - 120
                });
                break;
            case this.ACOPLE_BAJO:
                $(this.acopleMacho).css({
                    'top': $(bloqueContenedor.miDiv).position().top + $(bloqueContenedor.miDiv).height() - $(this.miDiv).height()
                });
                break;
        }
    }
    return ZonaDeAcople;
}());
