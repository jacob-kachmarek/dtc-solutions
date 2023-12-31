var searchButton = document.getElementById('search-button');
var userInput = document.getElementById("dtc-input");
async function fetchDTC() {
  const url = `https://car-code.p.rapidapi.com/obd2/${userInput.value}`;
  if (!userInput.value) {
    document.location = "index.html";
  }
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0926d4879amshe2cef15abe723e1p12e495jsn2d116e43d2e9',
      'X-RapidAPI-Host': 'car-code.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    localStorage.setItem("dtc", JSON.stringify(result));
    document.location.href = 'results.html';
  } catch (error) {
    console.error(error);
  }
}

searchButton.addEventListener('click',function(){
  fetchDTC();
});
userInput.addEventListener('keyup', function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchDTC();
  }
});
