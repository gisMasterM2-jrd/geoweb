//Creamos una función para convertir la respuesta de JSON GeoNames al formato GeoJSON

function terremotosGeonamesToGeoJSON(respuestaGeonames){

    //Mismo formato de codigo que la que nos de la web de ayuda: www.geojson.io
    //Al poner esta variable aquí voy generando cada ver un dato (no se suman)
    var geoJSON ={
        "type": "FeatureCollection",
        "features": []
    };
    //iteración de una lista para recorrer todos los datos que recibo 
    for (var i =0; i < respuestaGeonames.earthquakes.length; i++){
        //evento push que me pinta los datos que he recibido con el mismo código de la web de ayuda: www.geojson.io 
        geoJSON.features.push(
            {
                "type": "Feature",
                "properties": {"magnitude":respuestaGeonames.earthquakes[i].magnitude,
                                "datetime":respuestaGeonames.earthquakes[i].datetime },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    respuestaGeonames.earthquakes[i].lng,
                    respuestaGeonames.earthquakes[i].lat
                  ]
                }
              }
        );

    } //fin loop (voy llenando el var geoJSON con los datos que he ido cargando)

    return geoJSON;

    } //fin funcion (lo subo al source)


    //Segunda función getBounds. Construye otra petición a Geonames.
    function generarPeticionTerremotos() {

        //variable que le pido la siguiente información de los terremotos: coordenadas, el num. de terremotos, filtro por magnitud 5 y introduzco mi usuario
        //misma función que cuando entramos directamente en la web
        var mg = 5;
        if (map.getZoom()>8){
            mg=3;
        };

        var peticion = 'http://api.geonames.org/earthquakesJSON?' +
            'north=' + map.getBounds()._ne.lat + '&' +
            'south=' + map.getBounds()._sw.lat + '&' +
            'east=' + map.getBounds()._ne.lng + '&' +
            'west=' + map.getBounds()._sw.lng + '&' +
            'maxRows=200&' +
            'minMagnitude='+mg+'&' +
            'username=masterupc&';
    
        //envia función asincrona (generada en utils) que solicita la respusta de Geonames
        enviarPeticion(peticion).then(function (respuestaGeonames) {
    
            //Generamos una variable que me cambie la respuesta de JSON a GeoJSON
            var geoJSON = terremotosGeonamesToGeoJSON(respuestaGeonames);
    
            //Necesitamos crear un source y un layer. Con la función map.getSource genero el source y el layer si nos devuelve una respuesta
            if (map.getSource("terremotos_source")) {
    
                map.getSource("terremotos_source").setData(geoJSON);
    
            } else {
    
                map.addSource("terremotos_source", {
                    type: "geojson",
                    data: geoJSON
                });
    
                map.addLayer({
                    'id': 'terremotos',
                    'type': 'circle',
                    'source': 'terremotos_source',
                    'paint': {//simbologia de los terremotos con una graduación de color según el valor de su magnitud (interpolando en los valores intermedios)
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'magnitude'],
                            3, '#ebe709',
                            5, '#eb1809',
                            7, '#ef4bf2',
                        ],
                        'circle-opacity': 0.75,
                        'circle-radius': [//simbologia de los terremotos con una graduación de radio según el valor de su magnitud (interpolando en los valores intermedios)
                            'interpolate',
                            ['linear'], ['get', 'magnitude'],
                            3, 8,
                            5, 16,
                            8, 32
                        ]
                    }
                });
    
                map.addLayer({//añado otro layer para añadir un texto (transformado los puntos a texto)
                    'id': 'terremotos-textos',
                    'type': 'symbol',
                    'source': 'terremotos_source',
                    'layout': {
                        'text-field': [                            
                            'format', ['get', 'magnitude'],                               
                        ],
                        "text-font": [
                            "FiraSans-Italic"
                        ],
                        'text-size': 10
                    },
                    'paint': {
                        'text-color': 'rgba(0,0,0,1)'
                    }
                });
    
            }
    
        });
    
    } // fin funcion