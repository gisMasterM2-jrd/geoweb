function addEdificiosCapa() {
    //Añadimos una función que añada información al en el mapa

    map.addSource("edificios_source", {
        "type": "vector",
        "url": "mapbox://jorgerd2.3okvayw0"  // Nuestor ID TileSet

    }); //fin map source

    //Ahora vamos a añadir un estilo a la capa que pongamos (edificios catastro)
    map.addLayer({
        "id": "edificios",
        "type": "fill-extrusion",
        "source": "edificios_source",//mismo ID definido en la función anterior
        "source-layer": "construcciones-434nf5", // Nuestro nombre Tileset
        "maxzoom": 21,//opciones para que no se vea la capa con un zoom mayor que este
        "minzoom": 15,//opciones para que no se vea la capa con un zoom menor que este
        "filter": [">", "numberOfFloorsAboveGround", 0], //le aplicamos un filtro cuando lea los campos (tan solo los que tienen valor mayor que 0, tampoco los true)
        "paint": {//colores que vaos a aplicar a la capa
            "fill-extrusion-color": [//para colorear la extrusión de la capa
                "interpolate", ["linear"], ["number", ["get", "numberOfFloorsAboveGround"]],
                //vamos a interpolar linealmente según un campo del TileSet entre unos valores que decido (entre el mínimo y el màximo valor de la capa)
                0, "#FFFFFF",
                1, "#e6b03d",
                3, "#e6b03d",
                6, "#3de66d",
                9, "#3de6b1",
                12, "#22ecf0",
                15, "#14b1fd",
                20, "#3d73e6",
                40, "#123a8f",
                60, "#ce2f7e",
                106, "#ff4d4d"

            ],
            "fill-extrusion-height": [//para definir la propia extrusión de la capa
                "interpolate",
                ["linear"],
                ["zoom"],
                8, 0,
                12.5, 0,
                14, ["*", 1, ["to-number", ["get", "numberOfFloorsAboveGround"]]],
                16, ["*", 1.5, ["to-number", ["get", "numberOfFloorsAboveGround"]]],//magnifico la extrusión por 1.5 (según el zoom que haga)
                20, ["*", 2, ["to-number", ["get", "numberOfFloorsAboveGround"]]]//magnifico la extrusión por 2 (con este zoom)
            ],
            "fill-extrusion-opacity": 0.9//transparencia a la extrusión
        }
    },"road-label"); // fin addLayer capa texto "water-name-lakeline-platja", en MapBOX el ID de la capa: "road-label" (se añade en este punto porque va a ser la capa que se va poner por encima / orden de visualización)

}

//Función que hemos copiado de util.js, para poderla personalizar (queremos personalizar el popup)
//Cambiamos el nombre de la función por si la queremos utilizar más adelante (añadimos otra función al final)
function addPopupToMapEdificios2(nombreCapa) {

    map.on('click', nombreCapa, function (e) {
  
      var text = "";
      //console.info(e);
      for (key in e.features[0].properties) {
            if(key == "numberOfFloorsAboveGround"){
            //condición que añadimos para comparar dos valores dentro del bucle, así interceptamos lo que queremos que enseñe
        text += "<b>Numero de plantas</b>:" + e.features[0].properties[key] + "<br>";//También he cambiado el valor del texto que salia en el key por defecto
            }
      }
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(text)
        .addTo(map);
  
    });
  
    map.on('mouseenter', nombreCapa, function () {
      map.getCanvas().style.cursor = 'pointer';
    });
  
    map.on('mouseleave', nombreCapa, function () {
      map.getCanvas().style.cursor = '';
    });
  
}

//Funcion que añadimos para poder filtar los edificios por la altura
function filtrarEdificios(valor) {
    map.setFilter("edificios", [">", "numberOfFloorsAboveGround", parseInt(valor)]);
    
    document.getElementById("altura").innerHTML = "Altura superior a " + valor + "m.";

}

//Generamos la función para vincular el checkedBox con una acción que active o desactive la capa
function activarEdificios(activo){
    if (activo) {
        map.setLayoutProperty("edificios", "visibility", "visible");
    }else{
        map.setLayoutProperty("edificios", "visibility", "none");
    }
}

//Nueva funcion addPopup que sustituye a la de arriba para añadirle nuevas funcionalidades a mi visor (ver la ficha de catastro). Popup personalizado.
function addPopupToMapEdificios(nombreCapa) {

    map.on('click', nombreCapa, function (e) {

        var text = "";
        //console.info(e);
        for (key in e.features[0].properties) {

            if (key == "numberOfFloorsAboveGround") {
                text += "<b>Numero de plantas</b>:" + e.features[0].properties[key] + "<br>";
            }
            if (key == "localId") {
                //localId 0004702DF3800C_part1
                //http://ovc.catastro.meh.es/OVCServWeb/OVCWcfLibres/OVCFotoFachada.svc/RecuperarFotoFachadaGet?ReferenciaCatastral=0004701DF3800C
                //https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?rc1=0004701&rc2=DF3800C

                var localId = e.features[0].properties[key];

                var localIdSplit = localId.split("_"); // 0004702DF3800C  part1
                var parte1 = localIdSplit[0].substring(0, 7);
                var parte2 = localIdSplit[0].substring(7, localIdSplit[0].length);
                text += "<img width=200 src=http://ovc.catastro.meh.es/OVCServWeb/OVCWcfLibres/OVCFotoFachada.svc/RecuperarFotoFachadaGet?ReferenciaCatastral=" + localId + "><br>";
                text += "<a target=blank href=https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?rc1=" + parte1 + "&rc2=" + parte2 + ">Ficha</a><br>";

            }


        }
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(text)
            .addTo(map);

    });

    map.on('mouseenter', nombreCapa, function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', nombreCapa, function () {
        map.getCanvas().style.cursor = '';
    });

}