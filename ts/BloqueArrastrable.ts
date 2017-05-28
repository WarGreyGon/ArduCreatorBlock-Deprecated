class BloqueArrastrable{

    _this: BloqueArrastrable;
    miDiv: HTMLElement;
    categoria: string;
    tipo: string;
    bloquesQueContengo: BloqueArrastrable[] = [];




    constructor(categoria: string, tipo: string, elementoContenedor: HTMLElement){

        let div = document.createElement("div");
        div.className = "BloqueArrastrable " + categoria;
        div.innerHTML = tipo;
        elementoContenedor.appendChild(div);

        this.miDiv = div;
        this.categoria = categoria;
        this.tipo = tipo;
        this.arrastrarYSoltar(elementoContenedor);

        $(this.miDiv).data(this);//De este modo el div sabe de que objeto (BloqueArrastrable) es atributo
    }




    arrastrarYSoltar(elementoContenedor: HTMLElement): void{

        let bloqueValido: boolean = false;
        let zonaDeAcople: number = 0;

        $(this.miDiv).draggable({

            containment: $('.areaBloques'),
            cursor: 'move',

            drag: function(evento: Event, ui: JQuery){

                let bloqueQueManejo = ui.helper;
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                let numeroBloquesQueContengo: number = _thisBloqueQueManejo.bloquesQueContengo.length;
                let altoBloqueQueManejo = bloqueQueManejo.height();
                let bloquesHijoDelQueManejo = _thisBloqueQueManejo.bloquesQueContengo;

                bloqueQueManejo.css('z-index', 0);
                if (numeroBloquesQueContengo > 0)
                    _thisBloqueQueManejo.arrastrarHijosJuntoAPadre(_thisBloqueQueManejo, bloquesHijoDelQueManejo, 0);
            }
        });


        $(this.miDiv).droppable({

            accept: '.BloqueArrastrable',
            tolerance: "touch",

            over: function(evento: Event, ui: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                // bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);//<-----No funciona

                //TODO: Limitar zona de "tocado" como en blockly
                let offsetTop = bloqueQueManejo.position().top - bloqueQueSolapo.position().top;
                if(offsetTop <= bloqueQueSolapo.height() && offsetTop >= bloqueQueSolapo.height() - 15 && _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){

                    bloqueQueManejo.css({ 'border-top': 'solid green 5px' });
                } else if (offsetTop <= bloqueQueSolapo.height() && offsetTop >= bloqueQueSolapo.height() - 15 && _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){

                }
            },

            out: function(evento: Event, ui: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                if(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) > -1){

                    _thisBloqueQueSolapo.bloquesQueContengo.splice(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo), 1);
                    let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    let altoBloqueQueManejo = bloqueQueManejo.height();

                    bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1)) + "px");
                }

                bloqueQueManejo.css({ 'border-top': 0 })
            },

            drop: function (evento: Event, ui : JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                if(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) == -1 && _thisBloqueQueManejo.bloquesQueContengo.indexOf(_thisBloqueQueSolapo) == -1 &&
                    _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){

                    let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    let altoBloqueQueManejo = bloqueQueManejo.height();

                    //TODO: Cambiar esta asignacion de estilos por futuras clases o funcion
                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo*altoBloqueQueManejo + 40);
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");

                    _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                }
            }
        });
    }



    arrastrarHijosJuntoAPadre(bloquePadre: BloqueArrastrable, bloquesHijoDelQueManejo: BloqueArrastrable[], zIndex: number): void {

        bloquesHijoDelQueManejo.forEach(bloqueHijo => {

            zIndex++;
            $(bloqueHijo.miDiv).css({
                'left': $(bloquePadre.miDiv).position().left + 10,
                'top': $(bloquePadre.miDiv).position().top + bloquesHijoDelQueManejo.indexOf(bloqueHijo)*$(bloqueHijo.miDiv).height() + 40,
                'z-index': zIndex
            })

            if(bloqueHijo.bloquesQueContengo.length > 0)
                bloquePadre.arrastrarHijosJuntoAPadre(bloqueHijo, bloqueHijo.bloquesQueContengo, zIndex);
        });
    }


    esCategoriaAceptable(categoriaDelDraggable: string): boolean {

        let esValido = false;

        switch(this.categoria){

            case 'EstructuraBasica':

                ['EstructuraBasica', 'Funcion', 'Variable', 'Objeto'].forEach(c=>{if(c == categoriaDelDraggable)esValido = true;});
                break;
            case 'Funcion':
            case 'Objeto':

                ['Funcion', 'Variable'].forEach(c=>{if(c == categoriaDelDraggable)esValido = true;});
                break;
            case 'Variable':

                return false;
        }

        return esValido;
    }
}
