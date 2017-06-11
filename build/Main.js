"use strict";
$(".BloqueEnMenu").draggable({
    helper: 'clone',
    cursor: 'move',
    tolerance: 'fit',
    revert: true,
    start: function (evento, ui) {
        var bloqueQueManejo = ui.helper;
        $('.menuBloques').css('overflow-x', 'visible');
    },
    stop: function (evento, ui) {
        var bloqueQueManejo = ui.helper;
        $('.menuBloques').css('overflow-x', 'hidden');
    }
});
$(".areaBloques").droppable({
    accept: function (draggable) {
        if (draggable.hasClass("BloqueEnMenu") || draggable.hasClass("BloqueArrastrable")) {
            return true;
        }
    },
    drop: function (evento, ui) {
        if ($(ui.helper).hasClass('BloqueEnMenu')) {
            var dragEl = ui.helper.clone();
            var stopPosition = ui.helper.position();
            var categoria = $(ui.helper).attr('class').split(' ')[0];
            var tipo = $(ui.draggable).attr("id");
            ui.helper.remove();
            var bloqueClon = new BloqueArrastrable(categoria, tipo, $(evento.target).get(0));
            $(bloqueClon.miDiv).css({ top: stopPosition.top, left: stopPosition.left });
        }
    }
});
$('.papelera').droppable({
    accept: '.BloqueArrastrable',
    tolerance: 'touch',
    over: function (evento, ui) {
        hover($(this));
    },
    out: function (evento, ui) {
        unhover($(this));
    },
    drop: function (evento, ui) {
        var bloqueQueManejo = ui.helper;
        var _thisBloqueQueManejo = bloqueQueManejo.data();
        // eliminarHijos(_thisBloqueQueManejo.bloquesQueContengo);
        // bloqueQueManejo.empty();
        // bloqueQueManejo.remove();
        unhover($(this));
    }
});
function eliminarHijos(hijos) {
    // hijos.forEach(hijo => {
    //     if (hijo.bloquesQueContengo.length > 0){
    //         eliminarHijos(hijo.bloquesQueContengo);
    //     } else {
    //         $(hijo.miDiv).empty();
    //         $(hijo.miDiv).remove();
    //     };
    // });
}
// Evento de pasar sobre la papelera
function hover(element) { $(element).attr('src', 'imgs/bin-abierta.png'); }
function unhover(element) { $(element).attr('src', 'imgs/bin.png'); }
