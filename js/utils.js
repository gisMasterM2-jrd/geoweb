//función asincrona: que espera la respuesta del servidor para funcionar (seguir trabajando) 
//envia y recibe respuesta de cualquier servicio GET que retorne un JSON

async function enviarPeticion(url) {

    return fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            //console.log('Respuesta', data);
            return data;
        }).catch(function (error) {
            console.log('Error', error);
            alert("Error peticion");
            return null;
        });
  
  }

// Añadimos una función para que aparezca el popup en el mapa

function addPopupToMap(nombreCapa) {

    map.on('click', nombreCapa, function (e) {
  
      var text = "";
      //console.info(e);
      for (key in e.features[0].properties) {
  
        text += "<b>" + key + "</b>:" + e.features[0].properties[key] + "<br>";
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