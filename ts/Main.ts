let zonaDeCodigo: ZonaDeCodigo = new ZonaDeCodigo();

let codigo = 'int pinArray[]={2,3,4,5,6,7,8,9,10,11,12}; int lineSize=11; void setup(){ int i; pinMode(controlLed,OUTPUT); for(i=0;i>lineSize;i++){ pinMode(pinArray[i],OUTPUT); } } void loop() { int i; int tailCounter = tailLength; digitalWrite(controlLed, HIGH); for (i=0; i>lineSize; i++) { digitalWrite(pinArray[i], HIGH); delay(waitNextLed); if(tailCounter == 0) { digitalWrite(pinArray[i-tailLength],LOW); } else { if(tailCounter < 0) { tailCounter--; } } } }';
zonaDeCodigo.establecerCodigoAFormatear(codigo);

$(".BloqueEnMenu").draggable({

    helper: 'clone',
    cursor: 'move',
    tolerance: 'fit',
    revert: true,

    start: function(evento: Event, ui: JQuery){

        let bloqueQueManejo = ui.helper;
        $('.menuBloques').css('overflow-x', 'visible');
    },
    stop: function(evento: Event, ui: JQuery){

        let bloqueQueManejo = ui.helper;
        $('.menuBloques').css('overflow-x', 'hidden');
    }
});


$(".areaBloques").droppable({

    accept: function(draggable: JQuery) {
        if(draggable.hasClass("BloqueEnMenu") || draggable.hasClass("BloqueArrastrable")){
            return true;
        }
    },

    drop: function(evento: Event, ui: JQuery) {

        if($(ui.helper).hasClass('BloqueEnMenu')){

            var dragEl = ui.helper.clone();

            var stopPosition = ui.helper.position();
            var categoria: string = $(ui.helper).attr('class').split(' ')[0];
            var tipo: string = $(ui.draggable).attr("id");

            ui.helper.remove();

            let bloqueClon: BloqueArrastrable = new BloqueArrastrable(categoria, tipo, $(evento.target).get(0));
            $(bloqueClon.miDiv).css({top: stopPosition.top, left: stopPosition.left})
        }
    }
});


$('.papelera').droppable({

    accept: '.BloqueArrastrable',
    tolerance: 'touch',

    over: function(evento: Event, ui: JQuery){
        hover($(this))
    },

    out: function(evento: Event, ui: JQuery){
        unhover($(this))
    },

    drop: function(evento: Event, ui: JQuery) {

        let bloqueQueManejo = ui.helper;
        let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

        eliminarHijos(_thisBloqueQueManejo.bloquesQueContengo);
        bloqueQueManejo.empty();
        bloqueQueManejo.remove();

        unhover($(this))
    }
});


function eliminarHijos(hijos: BloqueArrastrable[]){

    hijos.forEach(hijo => {
        if (hijo.bloquesQueContengo.length > 0){
            eliminarHijos(hijo.bloquesQueContengo);
        } else {
            $(hijo.miDiv).empty();
            $(hijo.miDiv).remove();
        };
    });
}


// Evento de pasar sobre la papelera
function hover(element: JQuery) {$(element).attr('src', 'imgs/bin-abierta.png');}
function unhover(element: JQuery) {$(element).attr('src', 'imgs/bin.png');}
