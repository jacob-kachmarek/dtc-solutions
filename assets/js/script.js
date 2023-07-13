var searchButton = document.getElementById('search-button');
async function fetchDTC() {
    var userInput = document.getElementById("dtc-input");
    const url = `https://car-code.p.rapidapi.com/obd2/${userInput.value}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '0926d4879amshe2cef15abe723e1p12e495jsn2d116e43d2e9',
        'X-RapidAPI-Host': 'car-code.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response;
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  
  searchButton.addEventListener('click', function() {
    document.location.href = 'results.html';
    fetchDTC();
  })
  