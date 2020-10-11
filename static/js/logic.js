var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// color for legend
function getColor(d) {
    return d > 5 ? '#FF3333':
           d > 4 ? '#FF9033':
           d > 3 ? '#FFBF33':
           d > 2 ? '#FFE333':
           d > 1 ? '#E5FF33':
                   '#39FF33';
}

d3.json(baseURL, function(EQdata) {  
    createFeatures(EQdata.features);  
});

function createFeatures(earthquakeData) {
  
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><hr><p>Time: " + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p>");    
  }

  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {radius: feature.properties.mag * 5,
                                      fillColor: getColor(feature.properties.mag),
                                      color: "#000",
                                      weight: 1,
                                      opacity: 1,
                                      fillOpacity: 0.8});
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers  
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    // Set up legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


}