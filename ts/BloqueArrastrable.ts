class BloqueArrastrable{

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

    // bloquesQueContengo: BloqueArrastrable[] = [];
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

                let divQueManejo = ui.helper;
                let bloqueQueManejo: BloqueArrastrable = divQueManejo.data();

                // if (bloqueQueManejo.ultimosAcoplesColisionados.length > 0)
                //     bloqueQueManejo.arrastrasBloquesContiguos(bloqueQueManejo);

                try{

                    if (bloqueQueManejo.divsColisionan(bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimBloqueSolapado.miAcopleBajo)) {

                        $(bloqueQueManejo.ultimBloqueSolapado.miAcopleBajo).css({'background-color': 'blue'});
                        $(bloqueQueManejo.miAcopleHembra).css({'background-color': 'blue'});

                        bloqueQueManejo.ultimBloqueSolapado.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimBloqueSolapado.miAcopleBajo];
                        bloqueQueManejo.ultimBloqueSolapado.modoDeAcople = "BAJO";
                        console.log("BAJO")

                    } else if (bloqueQueManejo.divsColisionan(bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimBloqueSolapado.miAcopleInterno)) {

                        $(bloqueQueManejo.ultimBloqueSolapado.miAcopleInterno).css({'background-color': 'blue'});
                        $(bloqueQueManejo.miAcopleHembra).css({'background-color': 'blue'});

                        bloqueQueManejo.ultimBloqueSolapado.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleHembra, bloqueQueManejo.ultimBloqueSolapado.miAcopleInterno];
                        bloqueQueManejo.ultimBloqueSolapado.modoDeAcople = "INTERNO";
                        console.log("INTERNO")

                    } else if (bloqueQueManejo.divsColisionan(bloqueQueManejo.ultimBloqueSolapado.miAcopleHembra, bloqueQueManejo.miAcopleBajo)) {

                        $(bloqueQueManejo.miAcopleBajo).css({'background-color': 'blue'});
                        $(bloqueQueManejo.ultimBloqueSolapado.miAcopleHembra).css({'background-color': 'blue'});

                        bloqueQueManejo.ultimosAcoplesColisionados = [bloqueQueManejo.miAcopleBajo, bloqueQueManejo.ultimBloqueSolapado.miAcopleHembra];
                        bloqueQueManejo.modoDeAcople = "ALTO";
                        console.log("ALTO")

                    } else {

                        bloqueQueManejo.misAcoples.forEach(acople => { $(acople).css({'background-color': 'white'}); });
                        bloqueQueManejo.ultimBloqueSolapado.misAcoples.forEach(acople => { $(acople).css({'background-color': 'white'}); });

                        bloqueQueManejo.ultimosAcoplesColisionados = [];
                        bloqueQueManejo.ultimBloqueSolapado.ultimosAcoplesColisionados = [];
                        console.log("NA")

                    }
                } catch (exception) {
                    // console.log("EXCEPCION EN DRAGG")
                    if(exception.message == "Cannot read property 'miAcopleBajo' of undefined")
                        console.log("TODO BIEN");
                    else
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
                bloqueQueManejo.ultimBloqueSolapado = bloqueQueSolapo;
            },

            out: function(evento: Event, ui: JQuery) {

                // let divQueSolapo = $(evento.target);
                // let divQueManejo = ui.draggable;
                // let bloqueQueSolapo: BloqueArrastrable = divQueSolapo.data();
                // let bloqueQueManejo: BloqueArrastrable = divQueManejo.data();
            },

            drop: function (evento: Event, ui : JQuery) {

                let divQueSolapo = $(evento.target);
                let divQueManejo = ui.draggable;
                let bloqueQueSolapo: BloqueArrastrable = divQueSolapo.data();
                let bloqueQueManejo: BloqueArrastrable = divQueManejo.data();

                if (bloqueQueManejo.ultimBloqueSolapado.ultimosAcoplesColisionados.length > 0){//Acoples bajo e interno

                    let ultimosAcoplesColisionados = bloqueQueSolapo.ultimosAcoplesColisionados;

                    bloqueQueSolapo.imantarBloques(ultimosAcoplesColisionados);
                    bloqueQueSolapo.bloqueContiguo = bloqueQueManejo;

                } else if (bloqueQueManejo.ultimosAcoplesColisionados.length > 0) {//Acople alto

                    let ultimosAcoplesColisionados = bloqueQueManejo.ultimosAcoplesColisionados;

                    bloqueQueManejo.imantarBloques(ultimosAcoplesColisionados);
                    bloqueQueManejo.bloqueContiguo = bloqueQueSolapo;
                }
            }
        });
    }


    imantarBloques(ultimosAcoplesColisionados: HTMLElement[]): void{

        let offsetAcopleMacho = $(ultimosAcoplesColisionados[1]).offset();
        let topAcopleHembra = ultimosAcoplesColisionados[0].offsetTop;
        let leftAcopleHembra = ultimosAcoplesColisionados[0].offsetLeft;

        let padreAcopleHembra = $(ultimosAcoplesColisionados[0]).parent();

        padreAcopleHembra.offset({
            top: offsetAcopleMacho.top - topAcopleHembra,
            left: offsetAcopleMacho.left - leftAcopleHembra
        });
    }


    arrastrasBloquesContiguos(bloqueQueArrastro: BloqueArrastrable): void {

        try {
            // console.log(bloqueQueArrastro)
            let posicionHembra:number;
            let posicionMacho:number;

            if(bloqueQueArrastro.modoDeAcople == "ALTO"){
                posicionHembra = 1;
                posicionMacho = 0;
            } else if (bloqueQueArrastro.modoDeAcople == "ALTO" || bloqueQueArrastro.modoDeAcople == "ALTO"){
                posicionHembra = 0;
                posicionMacho = 1;
            }

            let offsetAcopleMacho = $(bloqueQueArrastro.ultimosAcoplesColisionados[0]).offset();

            let topAcopleHembra = bloqueQueArrastro.ultimosAcoplesColisionados[1].offsetTop;
            let leftAcopleHembra = bloqueQueArrastro.ultimosAcoplesColisionados[1].offsetLeft;

            let bloqueContiguo = $(bloqueQueArrastro.bloqueContiguo.miDiv);
            bloqueContiguo.offset({
                top: offsetAcopleMacho.top - topAcopleHembra,
                left: offsetAcopleMacho.left - leftAcopleHembra
            });

        } catch (excepcion){
            console.log("EXCEPCION EN MULTI-DRAGG")
            console.log(excepcion)
        }
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
