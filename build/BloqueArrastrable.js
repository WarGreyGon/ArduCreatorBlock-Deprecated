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
        var _this = this;
        $(this.miDiv).data(this);
        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move'
        });
        $(this.miDiv).droppable({
            accept: ".BloqueArrastrable",
            tolerance: "touch",
            over: function (evento, bloqueQueManejo) {
                var bloqueQueSolapo = $(evento.target);
                // bloqueQueSolapo.css('transform', 'scale(1.2)');
            },
            out: function (evento, bloqueQueManejo) {
                var bloqueQueSolapo = $(evento.target);
                // bloqueQueSolapo.css('border', '0');
            },
            drop: function (evento, ui) {
                var bloqueQueSolapo = $(evento.target);
                var bloqueQueManejo = ui.draggable;
                //TODO: Añadir reglas de introduccion en funcion del tipo
                if (true) {
                    var numeroBloquesQueContengo = _this.bloquesQueContengo.length;
                    var miAlto = bloqueQueManejo.height();
                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo * miAlto + 30);
                    bloqueQueManejo.css('border', 'solid white 5px');
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height() * (numeroBloquesQueContengo + 1) + 60) + "px");
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                    var _thisBloqueQueSolapo = bloqueQueSolapo.data();
                    _thisBloqueQueSolapo.bloquesQueContengo.push(_this);
                }
            }
        });
    };
    return BloqueArrastrable;
}());
