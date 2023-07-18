var resultsContainer = document.getElementById('results-container');
var backButton = document.getElementById('back-button');
var dtcResults = localStorage.getItem("dtc");
var dtcParsed = JSON.parse(dtcResults);
var descriptionEl = document.createElement('p');
var potentialCauseEl = document.createElement('p');
var dtcCodeEl = document.createElement('p');
var locationList = document.getElementById('location-list');
var locationInput = document.getElementById('location-input');

descriptionEl.textContent = "Definition: " + dtcParsed.definition;
potentialCauseEl.textContent = "Potential Causes: " + dtcParsed.cause;
dtcCodeEl.textContent = "DTC Code: " + dtcParsed.code;


if (dtcParsed.cause.length < 3) {
  var complexityLvlEasy = document.createElement('p');
  complexityLvlEasy.textContent = "Complexity: Easy";
  complexityLvlEasy.style.color = 'green';
  resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl, complexityLvlEasy);
} else if (dtcParsed.cause.length >= 3 && dtcParsed.cause.length <= 6) {
  var complexityLvlMed = document.createElement('p');
  complexityLvlMed.textContent = "Complexity: Medium";
  complexityLvlMed.style.color = 'yellow';
  resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl, complexityLvlMed);
} else {
  var complexityLvlHard = document.createElement('p');
  complexityLvlHard.textContent = "Complexity: Hard";
  complexityLvlHard.style.color = 'red';
  resultsContainer.append(dtcCodeEl, descriptionEl, potentialCauseEl, complexityLvlHard);
}
console.log(dtcParsed);

backButton.addEventListener('click', function () {
  document.location = "index.html";
})

// have not used towing container YET!
var towingContainer = document.getElementById('towing-container');
var map;
var service;
var infowindow;

var markers = []; // Defined markers for the functions 
var defaultLocation = { lat: 45.515232, lng: -122.678385 }; // Default location for the map

function initMap() { // Calling on the locations 
  if (navigator.geolocation) { // If the user allows the geolocation to see their location 
    navigator.geolocation.getCurrentPosition(function (position) {
      var userLocation = {
        lat: position.coords.latitude,// Translate position  into latitude and longitude
        lng: position.coords.longitude,
      };
      createMap(userLocation); // Creates the map for location being called 
    },
      function (error) { // Shows error message and presents the defauled location
        console.error('Error getting user location:', error);
        createMap(defaultLocation);
      }
    );
  } else { // If the user does not allow the geolocation then it will say this message and present the defauled location
    console.error('Geolocation is not supported by this browser.');
    createMap(defaultLocation);
  }
}


// Makes the map container and load the content
function createMap(locationObj) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: locationObj, //Centers the generalize location on the map
    zoom: 15,
  });

  var request = {
    location: locationObj,
    radius: '500', // How far out to search from the location 
    query: 'mechanics', // What to search for
  };

  service = new google.maps.places.PlacesService(map);// Creates all the locations near
  service.textSearch(request, callback); // Calls the search function
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(place);

      // Checkikng the appendLocations function to make sure its a function
      // for some reason it wasnt taking it as a function before ? 
      //appendLocations(place); <- Old call before
      if (typeof appendLocations === 'function') {
        appendLocations(place);
      }
    }
  }
}

function createMarker(place) {
  console.log(place);
  if (!place.geometry || !place.geometry.location) return;

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  markers.push(marker);

  infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', () => {
    infowindow.setContent(place.name + place.formatted_address || '');
    infowindow.open({ map, anchor: marker });
  });
}
var appendLocations = function (place) {
  var locationBox = document.createElement('div');
  locationBox.classList.add('location-box');

  var nameEl = document.createElement('h3');
  nameEl.textContent = place.name;

  var addressEl = document.createElement('p');
  addressEl.textContent = place.formatted_address;

  locationBox.appendChild(nameEl);
  locationBox.appendChild(addressEl);

  locationList.appendChild(locationBox);
};

var locationButton = document.getElementById('location-button');

locationButton.addEventListener('click', searchNearestMechanic);
locationInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchNearestMechanic();
  }
});

function searchNearestMechanic() {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationInput.value }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var location = results[0].geometry.location;
      map.setCenter(location);
      clearMarkers();
      var request = {
        query: 'mechanics',
        location: location,
        radius: '500',
      };
      service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          locationList.innerHTML = '';
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            appendLocations(results[i]);
          }
        }
      });
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
    anime({
      targets: '.tow',
      translateX: 325,
    });
  });
}
//Clear markers to get rid of the ones before and resetting the map
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// window.addEventListener('load', initMap);
// window.initMap = initMap;
function loadMap() {
  initMap();
}
window.addEventListener('load', loadMap);