var resultsContainer = document.getElementById('results-container');
var backButton = document.getElementById('back-button');
var dtcResults = localStorage.getItem("dtc");
var dtcParsed = JSON.parse(dtcResults);
var descriptionEl = document.createElement('p');
var potentialCauseEl = document.createElement('p');
var dtcCodeEl = document.createElement('p');

descriptionEl.textContent = "Definition: " + dtcParsed.definition;
potentialCauseEl.textContent = "Potential Causes: " + dtcParsed.cause;
dtcCodeEl.textContent = "DTC Code: " + dtcParsed.code;


if (dtcParsed.cause.length < 3) {
  var complexityLvlEasy = document.createElement('p');
  complexityLvlEasy.textContent = "Complexity: Easy";
  resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl, complexityLvlEasy);
} else if (dtcParsed.cause.length >= 3 && dtcParsed.cause.length <= 6) {
  var complexityLvlMed = document.createElement('p');
  complexityLvlMed.textContent = "Complexity: Medium";
  resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl, complexityLvlMed);
} else {
  var complexityLvlHard = document.createElement('p');
  complexityLvlHard.textContent = "Complexity: Hard";
  resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl, complexityLvlHard);
}
console.log(dtcParsed);

backButton.addEventListener('click', function() {
  document.location = "index.html";
})

// have not used towing container YET!
var towingContainer = document.getElementById('towing-container');
var map;
var service;
var infowindow;

function initMap() {
  var portland = new google.maps.LatLng(45.515232,-122.678385);

  map = new google.maps.Map(document.getElementById('map'), {
    center: portland,
    zoom: 15
  });

  var request = {
    location: portland,
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

  var marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name + place.formatted_address || "");

    infowindow.open({ map, anchor: marker });
  });
}

var locationButton = document.getElementById('location-button');

locationButton.addEventListener('click', searchNearestMechanic);

function searchNearestMechanic() {
  var locationInput = document.getElementById('location-input');

  // Use Geocoding API to retrieve the coordinates for the entered location
  // added .value
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationInput.value }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var location = results[0].geometry.location;

      // Use the retrieved coordinates in the Places API request
      var request = {
        query: 'mechanics',
        location: location,
        radius: '500',
      };

      service.textSearch(request, callback);
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
}

window.addEventListener('load', initMap);
window.initMap = initMap;
