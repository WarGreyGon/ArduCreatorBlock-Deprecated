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
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                if (_thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria))
                    bloqueQueManejo.css('cursor', 'no-drop');
            },
            out: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                //TODO: Implementar sacar bloque de otro
                if (_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) > -1) {
                    _thisBloqueQueSolapo.bloquesQueContengo.splice(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo));
                    var numeroBloquesQueContengo = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    var miAlto = bloqueQueManejo.height();
                    // TODO:Borrar siguientes linea
                    console.log(_thisBloqueQueSolapo.tipo + " se me ha salido " + _thisBloqueQueManejo.tipo);
                    console.log(_thisBloqueQueSolapo.tipo + " tengo " + numeroBloquesQueContengo + " bloques: ");
                    _thisBloqueQueSolapo.bloquesQueContengo.forEach(function (b) { console.log("\t" + b.tipo); });
                    bloqueQueManejo.css('border', '0');
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height() * (numeroBloquesQueContengo + 1) + 60) + "px");
                }
            },
            drop: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                var _thisBloqueQueManejo = bloqueQueManejo.data();
                if (_thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)) {
                    var numeroBloquesQueContengo = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    var miAlto = bloqueQueManejo.height();
                    //TODO: Cambiar esta asignacion de estilos por futuras clases o funcion
                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo * miAlto + 40);
                    bloqueQueManejo.css('border', 'solid white 5px');
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height() * (numeroBloquesQueContengo + 1) + 60) + "px");
                    _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                    // TODO:Borrar siguiente linea
                    console.log(_thisBloqueQueSolapo.tipo + " tengo " + numeroBloquesQueContengo + " bloques: ");
                    _thisBloqueQueSolapo.bloquesQueContengo.forEach(function (b) { console.log("\t" + b.tipo); });
                }
            }
        });
    };
    // reDimensionarBloqueContenedor(bloqueQueManejo: BloqueArrastrable, bloqueQueSolapo: BloqueArrastrable): void {
    //
    // }
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
