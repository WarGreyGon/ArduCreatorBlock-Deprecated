"use strict";
var BloqueArrastrable = (function () {
    function BloqueArrastrable(categoria, tipo, elementoContenedor) {
        this.bloquesQueContengo = [];
        var div = document.createElement("div");
        div.className = "BloqueArrastrable";
        div.innerHTML = tipo;
        elementoContenedor.appendChild(div);
        this.miDiv = div;
        this.categoria = categoria;
        this.tipo = tipo;
        this.arrastrarYSoltar(elementoContenedor);
        // ['EstructuraBasica' , 'Funcion', 'Variable'].forEach(c=>{console.log(categoria + " acepta " + c + ": " + this.esCategoriaAceptable(c))});
    }
    BloqueArrastrable.prototype.arrastrarYSoltar = function (elementoContenedor) {
        // let _this = this;
        //El div sabe de que objeto BloqueArrastrable es atributo
        $(this.miDiv).data(this);
        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move',
            start: function () {
            }
        });
        $(this.miDiv).droppable({
            accept: '.BloqueArrastrable',
            tolerance: "touch",
            over: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                // TODO: Borrar siguientes dos lineas
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                console.log(_thisBloqueQueSolapo.categoria + " acepta " + _thisBloqueQueManejo.categoria + ": " +
                    +_thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria));
            },
            out: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                // let bloqueQueManejo = ui.draggable;
            },
            drop: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                //TODO: Añadir reglas de introduccion en funcion del tipo
                if (_thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)) {
                    var numeroBloquesQueContengo = _thisBloqueQueManejo.bloquesQueContengo.length;
                    var miAlto = bloqueQueManejo.height();
                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo * miAlto + 40);
                    bloqueQueManejo.css('border', 'solid white 5px');
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height() * (numeroBloquesQueContengo + 1) + 60) + "px");
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                    _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                }
            }
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
                ['Funcion', 'Variable'].forEach(function (c) { if (categoriaDelDraggable.indexOf(c) + 1)
                    esValido = true; });
                break;
            case 'Variable':
                return false;
        }
        return esValido;
    };
    return BloqueArrastrable;
}());
