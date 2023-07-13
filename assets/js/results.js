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


