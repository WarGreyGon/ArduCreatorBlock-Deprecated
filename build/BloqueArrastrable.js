"use strict";
var BloqueArrastrable = (function () {
    function BloqueArrastrable(categoria, tipo, elementoContenedor) {
        this.misAcoples = [];
        this.ultimosAcoplesColisionados = [];
        this.modoDeAcople = "NA";
        this.bloquesQueContengo = [];
        var div = document.createElement("div");
        div.className = "BloqueArrastrable " + categoria;
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
                var bloqueQueManejo = ui.helper;
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                var numeroBloquesQueContengo = _thisBloqueQueManejo.bloquesQueContengo.length;
                var altoBloqueQueManejo = bloqueQueManejo.height();
                var bloquesHijoDelQueManejo = _thisBloqueQueManejo.bloquesQueContengo;
                // if (numeroBloquesQueContengo > 0)
                //     _thisBloqueQueManejo.arrastrarHijosJuntoAPadre(_thisBloqueQueManejo, bloquesHijoDelQueManejo, 0);
                if (_thisBloqueQueManejo.bloqueContiguo != undefined)
                    _thisBloqueQueManejo.arrastrasBloquesContiguos(_thisBloqueQueManejo);
                try {
                    if (_thisBloqueQueManejo.divsColisionan(_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleBajo)) {
                        $(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleBajo).css({ 'background-color': 'blue' });
                        $(_thisBloqueQueManejo.miAcopleHembra).css({ 'background-color': 'blue' });
                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleBajo];
                        _thisBloqueQueManejo.modoDeAcople = "BAJO";
                    }
                    else if (_thisBloqueQueManejo.divsColisionan(_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleInterno)) {
                        $(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleInterno).css({ 'background-color': 'blue' });
                        $(_thisBloqueQueManejo.miAcopleHembra).css({ 'background-color': 'blue' });
                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleInterno];
                        _thisBloqueQueManejo.modoDeAcople = "INTERNO";
                    }
                    else if (_thisBloqueQueManejo.divsColisionan(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleHembra, _thisBloqueQueManejo.miAcopleBajo)) {
                        $(_thisBloqueQueManejo.miAcopleBajo).css({ 'background-color': 'blue' });
                        $(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleHembra).css({ 'background-color': 'blue' });
                        _thisBloqueQueManejo.ultimBloqueSolapado.ultimosAcoplesColisionados = [_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleHembra, _thisBloqueQueManejo.miAcopleBajo];
                        _thisBloqueQueManejo.modoDeAcople = "ALTO";
                    }
                    else {
                        _thisBloqueQueManejo.misAcoples.forEach(function (acople) { $(acople).css({ 'background-color': 'white' }); });
                        _thisBloqueQueManejo.ultimBloqueSolapado.misAcoples.forEach(function (acople) { $(acople).css({ 'background-color': 'white' }); });
                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [];
                    }
                }
                catch (exception) {
                }
            }
        });
        $(this.miDiv).droppable({
            accept: '.BloqueArrastrable',
            tolerance: "touch",
            over: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.helper;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                _thisBloqueQueManejo.ultimBloqueSolapado = _thisBloqueQueSolapo;
            },
            out: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                // if(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) > -1){
                //
                //     _thisBloqueQueSolapo.bloquesQueContengo.splice(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo), 1);
                //     let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                //     let altoBloqueQueManejo = bloqueQueManejo.height();
                //
                //     bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1)) + "px");
                // }
            },
            drop: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                // if(_thisBloqueQueSolapo.bloquesQueContengo !== undefined && _thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) == -1
                //     && _thisBloqueQueManejo.bloquesQueContengo.indexOf(_thisBloqueQueSolapo) == -1 && _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){
                //
                //     let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                //     let altoBloqueQueManejo = bloqueQueManejo.height();
                //
                //     //TODO: Cambiar esta asignacion de estilos por futuras clases o funcion
                //     bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                //     bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo*altoBloqueQueManejo + 40);
                //     bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                //     bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");
                //
                //     _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                // }
                if (_thisBloqueQueManejo.ultimosAcoplesColisionados.length > 0) {
                    var ultimosAcoplesColisionados = _thisBloqueQueManejo.ultimosAcoplesColisionados;
                    var offsetAcopleMacho = $(ultimosAcoplesColisionados[1]).offset();
                    var offsetAcopleHembra = $(ultimosAcoplesColisionados[0]).offset();
                    var topAcopleHembra = ultimosAcoplesColisionados[0].offsetTop;
                    var leftAcopleHembra = ultimosAcoplesColisionados[0].offsetLeft;
                    var padreAcopleHembra = $(ultimosAcoplesColisionados[0]).parent();
                    padreAcopleHembra.offset({
                        top: offsetAcopleMacho.top - topAcopleHembra,
                        left: offsetAcopleMacho.left - leftAcopleHembra
                    });
                    switch (_thisBloqueQueManejo.modoDeAcople) {
                        case "INTERNO":
                        case "BAJO":
                            _thisBloqueQueManejo.ultimBloqueSolapado.bloqueContiguo = _thisBloqueQueManejo;
                            break;
                        case "ALTO":
                            _thisBloqueQueManejo.bloqueContiguo = _thisBloqueQueSolapo;
                            break;
                    }
                }
            }
        });
    };
    BloqueArrastrable.prototype.arrastrasBloquesContiguos = function (bloque) {
        try {
            // console.log(bloque)
            var offsetAcopleMacho = $(bloque.bloqueContiguo.ultimosAcoplesColisionados[1]).offset();
            var bloqueContiguo = $(bloque.bloqueContiguo.miDiv);
            var offsetAcopleHembra = $(bloque.bloqueContiguo.miAcopleHembra).offset();
            var topAcopleHembra = bloque.bloqueContiguo.miAcopleHembra.offsetTop;
            var leftAcopleHembra = bloque.bloqueContiguo.miAcopleHembra.offsetLeft;
            bloqueContiguo.offset({
                top: offsetAcopleMacho.top - topAcopleHembra,
                left: offsetAcopleMacho.left - leftAcopleHembra
            });
        }
        catch (excepcion) {
        }
    };
    BloqueArrastrable.prototype.arrastrarHijosJuntoAPadre = function (bloquePadre, bloquesHijoDelQueManejo, zIndex) {
        bloquesHijoDelQueManejo.forEach(function (bloqueHijo) {
            zIndex++;
            $(bloqueHijo.miDiv).css({
                'left': $(bloquePadre.miDiv).position().left + 10,
                'top': $(bloquePadre.miDiv).position().top + bloquesHijoDelQueManejo.indexOf(bloqueHijo) * $(bloqueHijo.miDiv).height() + 40,
                'z-index': zIndex
            });
            if (bloqueHijo.bloquesQueContengo.length > 0)
                bloqueHijo.arrastrarHijosJuntoAPadre(bloqueHijo, bloqueHijo.bloquesQueContengo, zIndex);
        });
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
    BloqueArrastrable.prototype.esCategoriaAceptable = function (categoriaDelDraggable) {
        var esValido = false;
        switch (this.categoria) {
            case 'EstructuraBasica':
                ['EstructuraBasica', 'Funcion', 'Variable', 'Objeto'].forEach(function (c) { if (c == categoriaDelDraggable)
                    esValido = true; });
                break;
            case 'Funcion':
            case 'Objeto':
                ['Funcion', 'Variable'].forEach(function (c) { if (c == categoriaDelDraggable)
                    esValido = true; });
                break;
            case 'Variable':
                return false;
        }
        return esValido;
    };
    return BloqueArrastrable;
}());
