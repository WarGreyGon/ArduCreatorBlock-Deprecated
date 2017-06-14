"use strict";
var zonaDeCodigo = new ZonaDeCodigo();
var codigo = 'int pinArray[]={2,3,4,5,6,7,8,9,10,11,12}; int lineSize=11; void setup(){ int i; pinMode(controlLed,OUTPUT); for(i=0;i>lineSize;i++){ pinMode(pinArray[i],OUTPUT); } if ( var1 == var2 ) { } } void loop() { int i; int tailCounter = tailLength; digitalWrite(controlLed, HIGH); for (i=0; i>OtraCosa; i++) { digitalWrite(pinArray[i], HIGH); delay(waitNextLed); } if(tailCounter == 0) { digitalWrite(pinArray[i-tailLength],LOW); } else { if(tailCounter < 0) { tailCounter--; } } } }';
zonaDeCodigo.establecerCodigoAFormatear(codigo);
var BloquesEnAreaDeBloques = [];
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
            BloquesEnAreaDeBloques.push(bloqueClon);
        }
    }
});
$('.areaBloques').change(function () {
    console.log("\n\n");
    for (var _i = 0, BloquesEnAreaDeBloques_1 = BloquesEnAreaDeBloques; _i < BloquesEnAreaDeBloques_1.length; _i++) {
        var b = BloquesEnAreaDeBloques_1[_i];
        console.log(b.devolverMiCodigo());
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
        bloqueQueManejo.empty();
        bloqueQueManejo.remove();
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
