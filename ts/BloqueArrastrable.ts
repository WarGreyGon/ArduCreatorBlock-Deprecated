class BloqueArrastrable{

    _this: BloqueArrastrable;
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

        // ['EstructuraBasica' , 'Funcion', 'Variable'].forEach(c=>{console.log(categoria + " acepta " + c + ": " + this.esCategoriaAceptable(c))});
    }




    arrastrarYSoltar(elementoContenedor: HTMLElement): void{

        // let _this = this;
        //El div sabe de que objeto BloqueArrastrable es atributo
        $(this.miDiv).data(this);

        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move',
            start: function(){

            }
        });


        $(this.miDiv).droppable({

            accept: '.BloqueArrastrable',
            tolerance: "touch",
            over: function(evento: Event, ui: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;

                // TODO: Borrar siguientes lineas (Testing)
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();
                console.log(_thisBloqueQueSolapo.categoria + " acepta "  + _thisBloqueQueManejo.categoria + ": " +
                    + _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria));
            },
            out: function(evento: Event, ui: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;

                //TODO: Implementar sacar bloque de otro
                
            },
            drop: function (evento: Event, ui : JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();


                if(_thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){

                    let numeroBloquesQueContengo: number = _thisBloqueQueManejo.bloquesQueContengo.length;
                    let miAlto = bloqueQueManejo.height();

                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo*miAlto + 40);
                    bloqueQueManejo.css('border', 'solid white 5px');
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);

                    _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                }
            }
        });
    }

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
