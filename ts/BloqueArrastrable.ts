class BloqueArrastrable{

    _this: BloqueArrastrable;
    miDiv: HTMLElement;

    miAcopleHembra: HTMLElement;
    miAcopleInterno: HTMLElement;
    miAcopleBajo: HTMLElement;
    misAcoples: HTMLElement[] = [];
    ultimosAcoplesColisionados: HTMLElement[] = [];

    modoDeAcople: string = "NA";
    ultimBloqueSolapado: BloqueArrastrable;

    categoria: string;
    tipo: string;


    bloquesQueContengo: BloqueArrastrable[] = [];
    bloqueContiguo: BloqueArrastrable;




    constructor(categoria: string, tipo: string, elementoContenedor: HTMLElement){

        let div = document.createElement("div");
        div.className = "BloqueArrastrable " + categoria;
        div.innerHTML = tipo;
        elementoContenedor.appendChild(div);

        this.miDiv = div;
        this.categoria = categoria;
        this.tipo = tipo;

        this.arrastrarYSoltar(elementoContenedor);
        this.establecerZonasDeAcople();
        $(this.miDiv).data(this);//De este modo el div sabe de que objeto (BloqueArrastrable) es atributo
    }




    arrastrarYSoltar(elementoContenedor: HTMLElement): void{

        $(this.miDiv).draggable({

            containment: $('.areaBloques'),
            cursor: 'move',

            drag: function(evento: Event, ui: JQuery){

                $('.menuBloques').css('width', '0');

                let bloqueQueManejo = ui.helper;
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                let numeroBloquesQueContengo: number = _thisBloqueQueManejo.bloquesQueContengo.length;
                let altoBloqueQueManejo = bloqueQueManejo.height();
                let bloquesHijoDelQueManejo = _thisBloqueQueManejo.bloquesQueContengo;

                // if (numeroBloquesQueContengo > 0)
                //     _thisBloqueQueManejo.arrastrarHijosJuntoAPadre(_thisBloqueQueManejo, bloquesHijoDelQueManejo, 0);

                if (_thisBloqueQueManejo.bloqueContiguo != undefined)
                    _thisBloqueQueManejo.arrastrasBloquesContiguos(_thisBloqueQueManejo);

                try{

                    if (_thisBloqueQueManejo.divsColisionan(_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleBajo)) {

                        $(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleBajo).css({'background-color': 'blue'});
                        $(_thisBloqueQueManejo.miAcopleHembra).css({'background-color': 'blue'});

                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleBajo];
                        _thisBloqueQueManejo.modoDeAcople = "BAJO";

                    } else if (_thisBloqueQueManejo.divsColisionan(_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleInterno)) {

                        $(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleInterno).css({'background-color': 'blue'});
                        $(_thisBloqueQueManejo.miAcopleHembra).css({'background-color': 'blue'});

                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [_thisBloqueQueManejo.miAcopleHembra, _thisBloqueQueManejo.ultimBloqueSolapado.miAcopleInterno];

                    } else if (_thisBloqueQueManejo.divsColisionan(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleHembra, _thisBloqueQueManejo.miAcopleBajo)) {

                        $(_thisBloqueQueManejo.miAcopleBajo).css({'background-color': 'blue'});
                        $(_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleHembra).css({'background-color': 'blue'});

                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [_thisBloqueQueManejo.ultimBloqueSolapado.miAcopleHembra, _thisBloqueQueManejo.miAcopleBajo];

                    } else {

                        _thisBloqueQueManejo.misAcoples.forEach(acople => { $(acople).css({'background-color': 'white'}); });
                        _thisBloqueQueManejo.ultimBloqueSolapado.misAcoples.forEach(acople => { $(acople).css({'background-color': 'white'}); });

                        _thisBloqueQueManejo.ultimosAcoplesColisionados = [];
                    }
                } catch (exception) {
                }
            }
        });


        $(this.miDiv).droppable({

            accept: '.BloqueArrastrable',
            tolerance: "touch",

            over: function(evento: Event, ui: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.helper;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                _thisBloqueQueManejo.ultimBloqueSolapado = _thisBloqueQueSolapo;
            },

            out: function(evento: Event, ui: JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                // if(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) > -1){
                //
                //     _thisBloqueQueSolapo.bloquesQueContengo.splice(_thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo), 1);
                //     let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                //     let altoBloqueQueManejo = bloqueQueManejo.height();
                //
                //     bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1)) + "px");
                // }
            },

            drop: function (evento: Event, ui : JQuery) {

                let bloqueQueSolapo = $(evento.target);
                let bloqueQueManejo = ui.draggable;
                let _thisBloqueQueSolapo: BloqueArrastrable = bloqueQueSolapo.data();
                let _thisBloqueQueManejo: BloqueArrastrable = bloqueQueManejo.data();

                // if(_thisBloqueQueSolapo.bloquesQueContengo !== undefined && _thisBloqueQueSolapo.bloquesQueContengo.indexOf(_thisBloqueQueManejo) == -1
                //     && _thisBloqueQueManejo.bloquesQueContengo.indexOf(_thisBloqueQueSolapo) == -1 && _thisBloqueQueSolapo.esCategoriaAceptable(_thisBloqueQueManejo.categoria)){
                //
                //     let numeroBloquesQueContengo: number = _thisBloqueQueSolapo.bloquesQueContengo.length;
                //     let altoBloqueQueManejo = bloqueQueManejo.height();
                //
                //     //TODO: Cambiar esta asignacion de estilos por futuras clases o funcion
                //     bloqueQueManejo.css('left', bloqueQueSolapo.position().left + 10);
                //     bloqueQueManejo.css('top', bloqueQueSolapo.position().top + numeroBloquesQueContengo*altoBloqueQueManejo + 40);
                //     bloqueQueManejo.css('z-index', bloqueQueSolapo.css('z-index') + 1);
                //     bloqueQueSolapo.css('height', (bloqueQueManejo.height()*(numeroBloquesQueContengo + 1) + 60) + "px");
                //
                //     _thisBloqueQueSolapo.bloquesQueContengo.push(_thisBloqueQueManejo);
                // }

                if (_thisBloqueQueManejo.ultimosAcoplesColisionados.length > 0){

                    let ultimosAcoplesColisionados = _thisBloqueQueManejo.ultimosAcoplesColisionados;

                    let offsetAcopleMacho = $(ultimosAcoplesColisionados[1]).offset();

                    let offsetAcopleHembra = $(ultimosAcoplesColisionados[0]).offset();
                    let topAcopleHembra = ultimosAcoplesColisionados[0].offsetTop;
                    let leftAcopleHembra = ultimosAcoplesColisionados[0].offsetLeft;

                    let padreAcopleHembra = $(ultimosAcoplesColisionados[0]).parent();

                    padreAcopleHembra.offset({
                        top: offsetAcopleMacho.top - topAcopleHembra,
                        left: offsetAcopleMacho.left - leftAcopleHembra
                    });

                    switch(_thisBloqueQueManejo.modoDeAcople) {

                        case "BAJO":
                            _thisBloqueQueManejo.ultimBloqueSolapado.bloqueContiguo = _thisBloqueQueManejo;
                            break;
                    }
                }
            }
        });
    }


    arrastrasBloquesContiguos(bloque: BloqueArrastrable): void {

        try {

            let offsetAcopleMacho = $(bloque.bloqueContiguo.ultimosAcoplesColisionados[1]).offset();
            let offsetAcopleHembra = $(bloque.bloqueContiguo.miAcopleHembra).offset();

            let topAcopleHembra = bloque.bloqueContiguo.miAcopleHembra.offsetTop;
            let leftAcopleHembra = bloque.bloqueContiguo.miAcopleHembra.offsetLeft;

            let bloqueContiguo = $(bloque.bloqueContiguo.miDiv);

            bloqueContiguo.offset({
                top: offsetAcopleMacho.top - topAcopleHembra,
                left: offsetAcopleMacho.left - leftAcopleHembra
            });
        } catch (excepcion){
        }
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
                bloqueHijo.arrastrarHijosJuntoAPadre(bloqueHijo, bloqueHijo.bloquesQueContengo, zIndex);
        });
    }


    establecerZonasDeAcople(): void {

        let miAcopleHembra;
        let miAcopleInterno;
        let miAcopleBajo;


        miAcopleHembra = new ZonaDeAcople(this, "acopleHembra");
        this.miAcopleHembra = miAcopleHembra.acopleHembra;

        this.misAcoples.push(miAcopleHembra.acopleHembra);

        switch(this.categoria) {

            case 'EstructuraBasica':
                miAcopleInterno = new ZonaDeAcople(this, "acopleInterno");
                this.miAcopleInterno = miAcopleInterno.acopleMacho;

                miAcopleBajo = new ZonaDeAcople(this, "acopleBajo");
                this.miAcopleBajo = miAcopleBajo.acopleMacho;

                this.misAcoples.push(miAcopleInterno.acopleMacho);
                this.misAcoples.push(miAcopleBajo.acopleMacho);
                break;

            case 'Funcion':
            case 'Objeto':
                miAcopleBajo = new ZonaDeAcople(this, "acopleBajo");
                this.miAcopleBajo = miAcopleBajo.acopleMacho;

                this.misAcoples.push(miAcopleBajo.acopleMacho);
                break;
        }
    }


    divsColisionan(div1: HTMLElement, div2: HTMLElement): boolean {

        try {

            let dqmArriba = $(div1).offset().top, dqmIzq = $(div1).offset().left, dqmAncho = $(div1).width(), dqmAlto = $(div1).height();
            let dqpsArriba = $(div2).offset().top, dqpsIzq = $(div2).offset().left, dqpsAncho = $(div2).width(), dqpsAlto = $(div2).height();

            if(dqmIzq + dqmAncho > dqpsIzq && dqmIzq < dqpsIzq + dqpsAncho && dqmArriba + dqmAlto > dqpsArriba && dqmArriba < dqpsArriba + dqpsAlto)
                return true;

        } catch(exception) {
        }

        return false;
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
