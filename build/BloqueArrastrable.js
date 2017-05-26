"use strict";
var BloqueArrastrable = (function () {
    function BloqueArrastrable(categoria, tipo, elementoContenedor) {
        this.bloquesQueContengo = [];
        var div = document.createElement("div");
        div.className = "BloqueArrastrable " + categoria;
        div.innerHTML = tipo;
        elementoContenedor.appendChild(div);
        this.miDiv = div;
        this.categoria = categoria;
        this.tipo = tipo;
        this.arrastrarYSoltar(elementoContenedor);
    }
    BloqueArrastrable.prototype.arrastrarYSoltar = function (elementoContenedor) {
        //De este modo el div sabe de que objeto (BloqueArrastrable) es atributo
        $(this.miDiv).data(this);
        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move',
            drag: function (evento, ui) {
                var bloqueQueManejo = ui.helper;
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                var numeroBloquesQueContengo = _thisBloqueQueManejo.bloquesQueContengo.length;
                var altoBloqueQueManejo = bloqueQueManejo.height();
                var bloquesHijoDelQueManejo = _thisBloqueQueManejo.bloquesQueContengo;
                if (numeroBloquesQueContengo > 0)
                    _thisBloqueQueManejo.arrastrarHijosJuntoAPadre(_thisBloqueQueManejo, bloquesHijoDelQueManejo);
            }
        });
        $(this.miDiv).droppable({
            accept: '.BloqueArrastrable',
            tolerance: "touch",
            over: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                //TODO: Limitar zona de "tocado" como en blockly
            },
            out: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                if (_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) > -1) {
                    _thisBloqueQueSolapo.bloquesQueContengo.splice(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo), 1);
                    var numeroBloquesQueContengo = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    var altoBloqueQueManejo = bloqueQueManejo.height();
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height() * (numeroBloquesQueContengo + 1)) + "px");
                }
            },
            drop: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                if (_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) == -1 &&
                    _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)) {
                    var numeroBloquesQueContengo = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    var altoBloqueQueManejo = bloqueQueManejo.height();
                    //TODO: Cambiar esta asignacion de estilos por futuras clases o funcion
                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo * altoBloqueQueManejo + 40);
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height() * (numeroBloquesQueContengo + 1) + 60) + "px");
                    _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                }
            }
        });
    };
    BloqueArrastrable.prototype.arrastrarHijosJuntoAPadre = function (bloquePadre, bloquesHijoDelQueManejo) {
        bloquesHijoDelQueManejo.forEach(function (bloqueHijo) {
            $(bloqueHijo.miDiv).css('left', $(bloquePadre.miDiv).position().left + 10);
            $(bloqueHijo.miDiv).css('top', $(bloquePadre.miDiv).position().top + bloquesHijoDelQueManejo.indexOf(bloqueHijo) * $(bloqueHijo.miDiv).height() + 40);
            if (bloqueHijo.bloquesQueContengo.length > 0)
                bloquePadre.arrastrarHijosJuntoAPadre(bloqueHijo, bloqueHijo.bloquesQueContengo);
        });
    };
    BloqueArrastrable.prototype.esCategoriaAceptable = function (categoriaDelDraggable) {
        var esValido = false;
        switch (this.categoria) {
            case 'EstructuraBasica':
                ['EstructuraBasica', 'Funcion', 'Variable'].forEach(function (c) { if (c == categoriaDelDraggable)
                    esValido = true; });
                break;
            case 'Funcion':
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
