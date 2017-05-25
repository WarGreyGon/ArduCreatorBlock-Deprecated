class BloqueArrastrable{

    //_this: BloqueArrastrable;
    miDiv: HTMLElement;
    categoria: string;
    tipo: string;
    bloquesQueContengo: BloqueArrastrable[] = [];




    constructor(categoria: string, tipo: string, elementoContenedor: HTMLElement){

        let div = document.createElement("div");
        div.className = "BloqueArrastrable";
        div.innerHTML = tipo;
        elementoContenedor.appendChild(div);

        this.miDiv = div;
        this.categoria = categoria;
        this.tipo = tipo;
        this.arrastrarYSoltar(elementoContenedor);
    }




    arrastrarYSoltar(elementoContenedor: HTMLElement): void{

        //De este modo el div sabe de que objeto (BloqueArrastrable) es atributo
        $(this.miDiv).data(this);

        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move',
            drag: function(evento: Event, ui: JQuery){

                // TODO: Arrastrar multiples padre con sus hijos
                let bloqueQueManejo = ui.helper;
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                let numeroBloquesQueContengo: number = _thisBloqueQueManejo.bloquesQueContengo.length;
                let altoBloqueQueManejo = bloqueQueManejo.height();
                let bloquesHijoDelQueManejo = _thisBloqueQueManejo.bloquesQueContengo;

                if (numeroBloquesQueContengo > 0) {

                    //TODO: Englobar estas lineas en un metodo recursivo. Iterar sobre hijos, comprobar que tengan nietos, si se cumple: llamada recursiva
                    bloquesHijoDelQueManejo.forEach(b => {

                        $(b.miDiv).css('left', bloqueQueManejo.position().left + 10);
                        $(b.miDiv).css('top', bloqueQueManejo.position().top + bloquesHijoDelQueManejo.indexOf(b)*$(b.miDiv).height() + 40);
                    });
                }
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

                //TODO: Limitar zona de "tocado" como en blockly
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

                    bloqueQueManejo.css('border', '0');
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");
                }
            },
            drop: function (evento: Event, ui : JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                //TODO: Añadir comprobacion de que no es ya hijo del padre en el que intenta introducirse. (Bug que provoca jesus)
                if(_thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){

                    let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                    let altoBloqueQueManejo = bloqueQueManejo.height();

                    //TODO: Cambiar esta asignacion de estilos por futuras clases o funcion
                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo*altoBloqueQueManejo + 40);
                    bloqueQueManejo.css('border', 'solid white 5px');
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");

                    _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                }
            }
        });
    }


    // reDimensionarBloqueContenedor(bloqueQueManejo: BloqueArrastrable, bloqueQueSolapo: BloqueArrastrable): void {
    //
    // }

    esCategoriaAceptable(categoriaDelDraggable: string): boolean {

        let esValido = false;

        switch(this.categoria){

            case 'EstructuraBasica':

                ['EstructuraBasica' , 'Funcion', 'Variable'].forEach(c=>{if(c == categoriaDelDraggable)esValido = true;});
                break;
            case 'Funcion':

                ['Funcion', 'Variable'].forEach(c=>{if(c == categoriaDelDraggable)esValido = true;});
                break;
            case 'Variable':

                return false;
        }

        return esValido;
    }
}
