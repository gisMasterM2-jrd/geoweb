// Generamos las variables que vamos a utilizar
var layerFarmacias;
var urlFarmacias = "datos/farmacias.geojson";

// función que va a cargar los datos de las farmacias, las va a pintar y las va a colocar.
function addDatosFarmacias() {

        // declaramos este nuevo objeto-variable según indicación del plugin del GITuB
        var puntosCluster = L.markerClusterGroup();
        
        // nos permite recorrer con el pluguin del GIT,  dandole las opciones (segun las opciones del pluguin LEAFLET)    
        layerFarmacias  = new L.GeoJSON.AJAX(urlFarmacias, {
            // la primera opción va a leer algunos datos escogidos del GeoJSON y me lo va a enseñar como un popup
            onEachFeature: function (feature, layer) {
                popupContent = "<b>" + feature.properties.EQUIPAMENT + "</b>"+
                "<br>" + feature.properties.TIPUS_VIA +
                ". " + feature.properties.NOM_CARRER +
                " " + feature.properties.NUM_CARRER_1 + "</b>";
                layer.bindPopup(popupContent);
            },

            // esta opción me va a leer cada punto y me va a dibujar un círculo según el estilo definido 
            // es en este punto donde se puede introducir la información (función) donde se puede dar simbologia a los puntos (ver préctica libre para probar)
            pointToLayer: function (feature, latlng) {
                // anñadimos esta linea antes del return (para que no se pare) y recoger todos los LatLong que estamos generando con la función
                puntosCluster.addLayer(L.marker(latlng));
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "#00ff00",
                    color: "#ffffff",
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        });

        // Le paso unas coordenadas y un zoom al mapa que cambie el estado inicial del mapa
        map.setView([41.399733,2.168598],13);

        // parte que añadimos a la variable de nuestro código fuente "mapabase" para que aparezcan las farmacias como un "overlay"
        controlCapas.addOverlay(layerFarmacias,"Farmacias");

        // añadimos la agrupación de puntos desactivada y como un "overlay"
        controlCapas.addOverlay(puntosCluster,"Cluster");

        // nuevas variables y funciones para realizar la búsqueda descargadas del pluguin del GITuB
        var searchControl = new L.Control.Search({
            layer: layerFarmacias,
            initial:false,
            propertyName: 'EQUIPAMENT',
            circleLocation: true,
            moveToLocation: function (latlng) {
                map.setView(latlng, 17);
            }
        });

        searchControl.on('search:locationfound', function(e) {
            e.layer.openPopup();
        });
        map.addControl(searchControl);

}