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

// Comaring the parsed DTC cause, and compared it to a valuem if its less than 3 then its easy to fix, else medium or hard. 
if (dtcParsed.cause.length < 3) {
  var complexityLvlEasy = document.createElement('p'); // Creates the easy level of complexity
  complexityLvlEasy.textContent = "Complexity: Easy";
  complexityLvlEasy.style.color = 'green'; // Sets the color of the easy level
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
// Back button to go back to index.html
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
// window.addEventListener('load', initMap);
// window.initMap = initMap;
function loadMap() { // For some reason the function was not working, saying google not defined here
  initMap();
}

window.addEventListener('load', loadMap); // Loads the loadMap function


// Makes the map container and load the content
function createMap(locationObj) {
  map = new google.maps.Map(document.getElementById('map'), { // points to the map element
    center: locationObj, //Centers the generalize location on the map
    zoom: 15, // zoom level of the map
  });

  var request = {
    location: locationObj, // Location of user
    radius: '500', // How far out to search from the location 
    query: 'mechanics', // What to search for
  };

  service = new google.maps.places.PlacesService(map);// Creates all the locations near
  service.textSearch(request, callback); // Calls the search function
}
//Call back used when searching up the locations in the map again 
function callback(results, status) {  // given the results and status, it will log them into the console
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results); // Shows the results in the console
    for (var i = 0; i < results.length; i++) { // Iterating through the results and creating markers for them 
      var place = results[i];
      createMarker(place);

      // Checkikng the appendLocations function to make sure its a function
      // for some reason it wasnt taking it as a function before ? 
      //appendLocations(place); <- Old call before
      if (typeof appendLocations === 'function') {
        appendLocations(place); //AppendLocations into location-box to display 
      }
    }
  }
}

function createMarker(place) { // Makes the markers for the locations
  console.log(place); // places them into the console
  if (!place.geometry || !place.geometry.location) return; // If the place has no location or area, return, Geometry is a geometric object from library 

  var marker = new google.maps.Marker({ // Creates the marker and places them in the map 
    map: map,
    position: place.geometry.location,
  });

  markers.push(marker); // Adds the marker to the array

  infowindow = new google.maps.InfoWindow(); // the small info box when you click on the marker
  google.maps.event.addListener(marker, 'click', () => {
    map.setCenter(marker.getPosition()); //displays position 
    map.setZoom(17); // Adjust the zoom level as needed
    infowindow.setContent(place.name + place.formatted_address || ''); //displays name and address 
    infowindow.open({ map, anchor: marker });
  });
}
// Makes teh location list with boxes within them 
var appendLocations = function (place, index) { 
  var locationBox = document.createElement('div');
  locationBox.classList.add('location-box');

  var nameEl = document.createElement('h3');
  nameEl.textContent = place.name;

  var addressEl = document.createElement('p');
  addressEl.textContent = place.formatted_address;

  locationBox.appendChild(nameEl);
  locationBox.appendChild(addressEl);

  locationBox.addEventListener('click', function () {
    google.maps.event.trigger(markers[index], 'click');
  }); // When you click on the box it will open the infowindow using the marker index to figure out which is which 

  locationList.appendChild(locationBox);
};

var locationButton = document.getElementById('location-button');

// Searching up the shops after submitting location 
locationButton.addEventListener('click', searchNearestMechanic);
locationInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchNearestMechanic();
  }
});
//  Searching up the shops after submitting location 
function searchNearestMechanic() {
  var geocoder = new google.maps.Geocoder(); // Calls the geocoder
  geocoder.geocode({ address: locationInput.value }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) { //If the status is okay, run code
      var location = results[0].geometry.location;
      map.setCenter(location); //Sets location in the middle of the map
      clearMarkers(); // Makes the markers around the loocation inputted 
      var request = {
        query: 'mechanics', // What to search for
        location: location, // Location of user
        radius: '500', //Sees how far out the search is
      };
      service.textSearch(request, function (results, status) { // Calls the search function
        if (status === google.maps.places.PlacesServiceStatus.OK) { // If the status is okay, run code
          locationList.innerHTML = ''; //Empty the list
          for (var i = 0; i < results.length; i++) { // Iterating through the results and creating markers for them and appending them to the list
            createMarker(results[i]); // Creates the marker and places them in the map
            appendLocations(results[i]); //AppendLocations into location-box to display
          }
        }
      });
    } else {
      console.error('Geocode was not successful for the following reason: ' + status); //If it fails then log it
    }
    anime({ // Makes the truch move over 
      targets: '.tow',
      translateX: 750,
    });
  });
}
//Clear markers to get rid of the ones before and resetting the map
function clearMarkers() { 
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = []; //Clears the markers
}




