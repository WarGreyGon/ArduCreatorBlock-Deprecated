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
    }




    arrastrarYSoltar(elementoContenedor: HTMLElement): void{

        let _this = this;
        $(this.miDiv).data(this);

        $(this.miDiv).draggable({
            containment: $('.areaBloques'),
            cursor: 'move'
        });

        $(this.miDiv).droppable({
            accept: ".BloqueArrastrable",
            tolerance: "touch",
            over: function(evento: Event, bloqueQueManejo: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                // bloqueQueSolapo.css('transform', 'scale(1.2)');
            },
            out: function(evento: Event, bloqueQueManejo: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                // bloqueQueSolapo.css('border', '0');
            },
            drop: function (evento: Event, ui : JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;

                //TODO: Añadir reglas de introduccion en funcion del tipo
                if(true){

                    let numeroBloquesQueContengo: number = _this.bloquesQueContengo.length;
                    let miAlto = bloqueQueManejo.height();

                    bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                    bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo*miAlto + 30);
                    bloqueQueManejo.css('border', 'solid white 5px');
                    bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");
                    bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);

                    let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                    _thisBloqueQueSolapo.bloquesQueContengo.push(_this);
                }
            }
        });
    }
}
