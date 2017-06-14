"use strict";
var BloqueArrastrable = (function () {
    function BloqueArrastrable(categoria, tipo, elementoContenedor) {
        this.misAcoples = [];
        this.ultimosAcoplesColisionados = [];
        this.modoDeAcople = "NA";
        this.miCodigo = "";
        var div = document.createElement("div");
        div.className = "BloqueArrastrable " + categoria;
        $(div).css({ 'background-image': 'url("imgs/If.png")' });
        div.innerHTML = tipo;
        elementoContenedor.appendChild(div);
        this.miDiv = div;
        this.categoria = categoria;
        this.tipo = tipo;
        this.arrastrarYSoltar(elementoContenedor);
        this.establecerZonasDeAcople();
        $(this.miDiv).data(this); //De este modo el div sabe de que objeto (BloqueArrastrable) es atributo
    }
    BloqueArrastrable.prototype.arrastrarYSoltar = function (elementoContenedor) {
        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move',
            drag: function (evento, ui) {
                $('.menuBloques').css('width', '0');
                var divQueManejo = ui.helper;
                var bloqueQueManejo = divQueManejo.data();
                if (bloqueQueManejo.bloqueContiguo != undefined)
                    console.log("bloqueContiguo: " + bloqueQueManejo.bloqueContiguo.tipo + "-" + bloqueQueManejo.ultimoBloqueSolapado.bloqueContiguo);
                if (bloqueQueManejo.bloqueInterno != undefined)
                    console.log("bloqueInterno: " + bloqueQueManejo.bloqueInterno.tipo + "-" + bloqueQueManejo.ultimoBloqueSolapado.bloqueContiguo);
                try {
                    if (bloqueQueManejo.divsColisionan(bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleBajo)) {
                        $(bloqueQueManejo.ultimoBloqueSolapado.miAcopleBajo).css({ 'background-color': 'white' });
                        $(bloqueQueManejo.miAcopleHembra).css({ 'background-color': 'white' });
                        bloqueQueManejo.ultimoBloqueSolapado.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleBajo];
                        bloqueQueManejo.ultimoBloqueSolapado.modoDeAcople = "BAJO";
                        // console.log("BAJO")
                    }
                    else if (bloqueQueManejo.divsColisionan(bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleInterno)) {
                        $(bloqueQueManejo.ultimoBloqueSolapado.miAcopleInterno).css({ 'background-color': 'white' });
                        $(bloqueQueManejo.miAcopleHembra).css({ 'background-color': 'white' });
                        bloqueQueManejo.ultimoBloqueSolapado.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleInterno];
                        bloqueQueManejo.ultimoBloqueSolapado.modoDeAcople = "INTERNO";
                        // console.log("INTERNO")
                    }
                    else if (bloqueQueManejo.divsColisionan(bloqueQueManejo.ultimoBloqueSolapado.miAcopleHembra, bloqueQueManejo.miAcopleBajo)) {
                        $(bloqueQueManejo.miAcopleBajo).css({ 'background-color': 'white' });
                        $(bloqueQueManejo.ultimoBloqueSolapado.miAcopleHembra).css({ 'background-color': 'white' });
                        bloqueQueManejo.ultimosAcoplesColisionados = [bloqueQueManejo.ultimoBloqueSolapado.miAcopleHembra, bloqueQueManejo.miAcopleBajo];
                        bloqueQueManejo.modoDeAcople = "ALTO";
                        // console.log("ALTO")
                    }
                    else {
                        bloqueQueManejo.misAcoples.forEach(function (acople) { $(acople).css({ 'background-color': 'transparent' }); });
                        bloqueQueManejo.ultimoBloqueSolapado.misAcoples.forEach(function (acople) { $(acople).css({ 'background-color': 'transparent' }); });
                        bloqueQueManejo.resetearCondicionesDeAcople(bloqueQueManejo, bloqueQueManejo.ultimoBloqueSolapado);
                        // console.log("NA")
                    }
                }
                catch (exception) {
                    if (exception.message != "Cannot read property 'miAcopleBajo' of undefined")
                        console.log(exception.message);
                }
            }
        });
        $(this.miDiv).droppable({
            accept: '.BloqueArrastrable',
            tolerance: "touch",
            over: function (evento, ui) {
                var divQueSolapo = $(evento.target);
                var divQueManejo = ui.draggable;
                var bloqueQueSolapo = divQueSolapo.data();
                var bloqueQueManejo = divQueManejo.data();
                divQueManejo.css('z-index', divQueSolapo.css('z-index') + 1);
                bloqueQueManejo.ultimoBloqueSolapado = bloqueQueSolapo;
            },
            drop: function (evento, ui) {
                var divQueSolapo = $(evento.target);
                var divQueManejo = ui.draggable;
                var bloqueQueSolapo = divQueSolapo.data();
                var bloqueQueManejo = divQueManejo.data();
                try {
                    if (bloqueQueManejo.modoDeAcople == "ALTO") {
                        bloqueQueManejo.imantarBloques(bloqueQueManejo.ultimosAcoplesColisionados);
                        bloqueQueManejo.bloqueContiguo = bloqueQueSolapo;
                    }
                    else if (bloqueQueSolapo.modoDeAcople == "INTERNO") {
                        bloqueQueSolapo.imantarBloques(bloqueQueSolapo.ultimosAcoplesColisionados);
                        bloqueQueSolapo.bloqueInterno = bloqueQueManejo;
                    }
                    else if (bloqueQueSolapo.modoDeAcople == "BAJO") {
                        bloqueQueSolapo.imantarBloques(bloqueQueSolapo.ultimosAcoplesColisionados);
                        bloqueQueSolapo.bloqueContiguo = bloqueQueManejo;
                    }
                }
                catch (excepcion) {
                    console.log("Excepcion en MULTI-DROP");
                    console.log(excepcion.message);
                }
            }
        });
    };
    BloqueArrastrable.prototype.imantarBloques = function (ultimosAcoplesColisionados) {
        var offsetAcopleMacho = $(ultimosAcoplesColisionados[1]).offset();
        var topAcopleHembra = ultimosAcoplesColisionados[0].offsetTop;
        var leftAcopleHembra = ultimosAcoplesColisionados[0].offsetLeft;
        var padreAcopleHembra = $(ultimosAcoplesColisionados[0]).parent();
        padreAcopleHembra.offset({
            top: offsetAcopleMacho.top - topAcopleHembra,
            left: offsetAcopleMacho.left - leftAcopleHembra
        });
    };
    BloqueArrastrable.prototype.resetearCondicionesDeAcople = function (bloqueQueManejo, ultimoBloqueSolapado) {
        bloqueQueManejo.ultimosAcoplesColisionados = [];
        bloqueQueManejo.ultimoBloqueSolapado.ultimosAcoplesColisionados = [];
        bloqueQueManejo.modoDeAcople = "NA";
        bloqueQueManejo.ultimoBloqueSolapado.modoDeAcople = "NA";
        if (bloqueQueManejo.bloqueContiguo == bloqueQueManejo.ultimoBloqueSolapado) {
            bloqueQueManejo.bloqueContiguo = undefined;
        }
        else if (bloqueQueManejo.bloqueInterno == bloqueQueManejo.ultimoBloqueSolapado) {
            bloqueQueManejo.bloqueInterno = undefined;
        }
    };
    BloqueArrastrable.prototype.arrastrasBloquesContiguos = function (bloqueQueArrastro) {
        //TODO: Añadir a un array, por ej: grupoDeBloquesParaArrastrar todos los bloques que queramos arrastrar y con JQuery
        // y el metodo translate() de CSS
    };
    BloqueArrastrable.prototype.establecerZonasDeAcople = function () {
        var miAcopleHembra;
        var miAcopleInterno;
        var miAcopleBajo;
        miAcopleHembra = new ZonaDeAcople(this, "acopleHembra");
        this.miAcopleHembra = miAcopleHembra.acopleHembra;
        this.misAcoples.push(miAcopleHembra.acopleHembra);
        switch (this.categoria) {
            case 'EstructuraBasica':
                miAcopleInterno = new ZonaDeAcople(this, "acopleInterno");
                this.miAcopleInterno = miAcopleInterno.acopleMacho;
                miAcopleBajo = new ZonaDeAcople(this, "acopleBajo");
                this.miAcopleBajo = miAcopleBajo.acopleMacho;
                this.misAcoples.push(miAcopleInterno.acopleMacho);
                this.misAcoples.push(miAcopleBajo.acopleMacho);
                break;
            case 'Funcion':
            case 'Objeto':
                miAcopleBajo = new ZonaDeAcople(this, "acopleBajo");
                this.miAcopleBajo = miAcopleBajo.acopleMacho;
                this.misAcoples.push(miAcopleBajo.acopleMacho);
                break;
        }
    };
    BloqueArrastrable.prototype.divsColisionan = function (div1, div2) {
        try {
            var dqmArriba = $(div1).offset().top, dqmIzq = $(div1).offset().left, dqmAncho = $(div1).width(), dqmAlto = $(div1).height();
            var dqpsArriba = $(div2).offset().top, dqpsIzq = $(div2).offset().left, dqpsAncho = $(div2).width(), dqpsAlto = $(div2).height();
            if (dqmIzq + dqmAncho > dqpsIzq && dqmIzq < dqpsIzq + dqpsAncho && dqmArriba + dqmAlto > dqpsArriba && dqmArriba < dqpsArriba + dqpsAlto)
                return true;
        }
        catch (exception) {
        }
        return false;
    };
    return BloqueArrastrable;
}());
