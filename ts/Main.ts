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
