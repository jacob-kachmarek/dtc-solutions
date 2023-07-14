var resultsContainer = document.getElementById('results-container');

var dtcResults = localStorage.getItem("dtc");
var dtcParsed = JSON.parse(dtcResults);
var descriptionEl = document.createElement('p');
var potentialCauseEl = document.createElement('p');
var dtcCodeEl = document.createElement('p');

descriptionEl.textContent = "Definition: " + dtcParsed.definition;
potentialCauseEl.textContent = "Potential Causes: " + dtcParsed.cause;
dtcCodeEl.textContent = "DTC Code: " + dtcParsed.code;

resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl);
console.log(dtcParsed);

var towingContainer = document.getElementById('towing-container');
var map;
var service;
var infowindow;

function initMap() {
  var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

  var request = {
    location: pyrmont,
    radius: '500',
    query: 'mechanics',
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}
function createMarker(place) {
  console.log(place);
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name + place.formatted_address || "");

    infowindow.open({ map, anchor: marker });
  });
}

window.initMap = initMap;
