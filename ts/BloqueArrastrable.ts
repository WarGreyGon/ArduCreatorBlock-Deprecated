class BloqueArrastrable{

    miDiv: HTMLElement;

    miAcopleHembra: HTMLElement;
    miAcopleInterno: HTMLElement;
    miAcopleBajo: HTMLElement;
    misAcoples: HTMLElement[] = [];

    ultimosAcoplesColisionados: HTMLElement[] = [];
    modoDeAcople: string = "NA";

    ultimoBloqueSolapado: BloqueArrastrable;

    categoria: string;
    tipo: string;

    bloqueContiguo: BloqueArrastrable;
    bloqueInterno: BloqueArrastrable;




    constructor(categoria: string, tipo: string, elementoContenedor: HTMLElement){

        let div = document.createElement("div");
        div.className = "BloqueArrastrable " + categoria;
        $(div).css({'background-image': 'url("imgs/If.png")'});
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

                let divQueManejo = ui.helper;
                let bloqueQueManejo: BloqueArrastrable = divQueManejo.data();


                if (bloqueQueManejo.bloqueContiguo != undefined)
                    console.log("bloqueContiguo: " + bloqueQueManejo.bloqueContiguo.tipo + "-" + bloqueQueManejo.ultimoBloqueSolapado.bloqueContiguo);
                if (bloqueQueManejo.bloqueInterno != undefined)
                    console.log("bloqueInterno: " + bloqueQueManejo.bloqueInterno.tipo + "-" + bloqueQueManejo.ultimoBloqueSolapado.bloqueContiguo);

                try{

                    if (bloqueQueManejo.divsColisionan(bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleBajo)) {

                        $(bloqueQueManejo.ultimoBloqueSolapado.miAcopleBajo).css({'background-color': 'blue'});
                        $(bloqueQueManejo.miAcopleHembra).css({'background-color': 'blue'});

                        bloqueQueManejo.ultimoBloqueSolapado.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleBajo];
                        bloqueQueManejo.ultimoBloqueSolapado.modoDeAcople = "BAJO";
                        // console.log("BAJO")

                    } else if (bloqueQueManejo.divsColisionan(bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleInterno)) {

                        $(bloqueQueManejo.ultimoBloqueSolapado.miAcopleInterno).css({'background-color': 'blue'});
                        $(bloqueQueManejo.miAcopleHembra).css({'background-color': 'blue'});

                        bloqueQueManejo.ultimoBloqueSolapado.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimoBloqueSolapado.miAcopleInterno];
                        bloqueQueManejo.ultimoBloqueSolapado.modoDeAcople = "INTERNO";
                        // console.log("INTERNO")

                    } else if (bloqueQueManejo.divsColisionan(bloqueQueManejo.ultimoBloqueSolapado.miAcopleHembra, bloqueQueManejo.miAcopleBajo)) {

                        $(bloqueQueManejo.miAcopleBajo).css({'background-color': 'blue'});
                        $(bloqueQueManejo.ultimoBloqueSolapado.miAcopleHembra).css({'background-color': 'blue'});

                        bloqueQueManejo.ultimosAcoplesColisionados = [bloqueQueManejo.ultimoBloqueSolapado.miAcopleHembra, bloqueQueManejo.miAcopleBajo];
                        bloqueQueManejo.modoDeAcople = "ALTO";
                        // console.log("ALTO")

                    } else {

                        bloqueQueManejo.misAcoples.forEach(acople => { $(acople).css({'background-color': 'white'}); });
                        bloqueQueManejo.ultimoBloqueSolapado.misAcoples.forEach(acople => { $(acople).css({'background-color': 'white'}); });

                        bloqueQueManejo.resetearCondicionesDeAcople(bloqueQueManejo, bloqueQueManejo.ultimoBloqueSolapado);
                        // console.log("NA")
                    }

                } catch (exception) {

                    if(exception.message != "Cannot read property 'miAcopleBajo' of undefined")
                        console.log(exception.message);
                }
            }
        });


        $(this.miDiv).droppable({

            accept: '.BloqueArrastrable',
            tolerance: "touch",

            over: function(evento: Event, ui: JQuery) {

                let divQueSolapo = $(evento.target);
                let divQueManejo = ui.draggable;
                let bloqueQueSolapo: BloqueArrastrable = divQueSolapo.data();
                let bloqueQueManejo: BloqueArrastrable = divQueManejo.data();

                divQueManejo.css('z-index', divQueSolapo.css('z-index') + 1);
                bloqueQueManejo.ultimoBloqueSolapado = bloqueQueSolapo;
            },

            drop: function (evento: Event, ui : JQuery) {

                let divQueSolapo = $(evento.target);
                let divQueManejo = ui.draggable;
                let bloqueQueSolapo: BloqueArrastrable = divQueSolapo.data();
                let bloqueQueManejo: BloqueArrastrable = divQueManejo.data();

                try{

                    if (bloqueQueManejo.modoDeAcople == "ALTO") {

                        bloqueQueManejo.imantarBloques(bloqueQueManejo.ultimosAcoplesColisionados);
                        bloqueQueManejo.bloqueContiguo = bloqueQueSolapo

                    } else if (bloqueQueSolapo.modoDeAcople == "INTERNO") {

                        bloqueQueSolapo.imantarBloques(bloqueQueSolapo.ultimosAcoplesColisionados);
                        bloqueQueSolapo.bloqueInterno = bloqueQueManejo;

                    } else if (bloqueQueSolapo.modoDeAcople == "BAJO") {

                        bloqueQueSolapo.imantarBloques(bloqueQueSolapo.ultimosAcoplesColisionados);
                        bloqueQueSolapo.bloqueContiguo = bloqueQueManejo;
                    }
                } catch (excepcion) {
                    console.log("Excepcion en MULTI-DROP")
                    console.log(excepcion.message)
                }
            }
        });
    }


    imantarBloques(ultimosAcoplesColisionados: HTMLElement[]): void {

        let offsetAcopleMacho = $(ultimosAcoplesColisionados[1]).offset();
        let topAcopleHembra = ultimosAcoplesColisionados[0].offsetTop;
        let leftAcopleHembra = ultimosAcoplesColisionados[0].offsetLeft;

        let padreAcopleHembra = $(ultimosAcoplesColisionados[0]).parent();

        padreAcopleHembra.offset({
            top: offsetAcopleMacho.top - topAcopleHembra,
            left: offsetAcopleMacho.left - leftAcopleHembra
        });
    }


    resetearCondicionesDeAcople(bloqueQueManejo: BloqueArrastrable, ultimoBloqueSolapado: BloqueArrastrable): void {

        bloqueQueManejo.ultimosAcoplesColisionados = [];
        bloqueQueManejo.ultimoBloqueSolapado.ultimosAcoplesColisionados = [];
        bloqueQueManejo.modoDeAcople = "NA";
        bloqueQueManejo.ultimoBloqueSolapado.modoDeAcople = "NA";

        if(bloqueQueManejo.bloqueContiguo == bloqueQueManejo.ultimoBloqueSolapado) {
            bloqueQueManejo.bloqueContiguo = undefined;
        } else if (bloqueQueManejo.bloqueInterno == bloqueQueManejo.ultimoBloqueSolapado) {
            bloqueQueManejo.bloqueInterno = undefined;
        }
    }


    arrastrasBloquesContiguos(bloqueQueArrastro: BloqueArrastrable): void {

        
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
