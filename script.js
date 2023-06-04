const heading = document.getElementById("heading");
const image = document.getElementById("img");
const title = document.getElementById("title");
const explanation = document.getElementById("explanation");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("btn");
const searchHistoryElement = document.getElementById("search-history");

let isNotCurrDate = false;

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];

  localStorage.removeItem("searchedData");

  fetchTheImageOfTheDay(currentDate);
}
function fetchTheImageOfTheDay(adate) {
  const api = `https://api.nasa.gov/planetary/apod?api_key=8scGDMpFXskvtqDVcdZIANwgQ95w8QgSNejhMqfr&date=${adate}`;
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      const dataTitle = data.title;
      const dataExplanation = data.explanation;
      const imageUrl = data.url;

      if (!isNotCurrDate) {
        heading.innerText = `NASA Picture of the Day`;
      } else {
        heading.innerText = `Picture on ${data.date}`;
      }
      isNotCurrDate = true;
      title.innerText = dataTitle;
      explanation.innerText = dataExplanation;
      image.setAttribute("src", imageUrl);
    })
    .catch((error) => {
      // console.log('This is the error', error);
      alert(error.response);
    });
}

// search btn click to get image of the day
searchBtn.addEventListener("click", getImageOfTheDay);
function getImageOfTheDay(e) {
  // stop the default behavihar
  e.preventDefault();
  // call the fetch the image of the day
  fetchTheImageOfTheDay(searchInput.value);
  // save the searches
  saveSearch(searchInput.value);
  // call the add to search history
  addSearchToHistory();
}

//saving the searches
function saveSearch(date) {
  const searches = JSON.parse(localStorage.getItem("searchedData")) || [];
  searches.push(date);
  localStorage.setItem("searchedData", JSON.stringify(searches));
}

// add to search
function addSearchToHistory() {
  //get the parsed data
  const searchesData = JSON.parse(localStorage.getItem("searchedData")) || [];

  //emptying the previous data to restrict overflow of duplicates
  searchHistoryElement.innerHTML = "";

  //iterating over the array of parsed data
  searchesData.forEach((e) => {
    const a = document.createElement("a");
    a.textContent = e;
    a.href = "#";
    a.style.display = "block";

    //adding eventListeners
    a.addEventListener("click", () => {
      fetchTheImageOfTheDay(e);
    });

    searchHistoryElement.appendChild(a);
  });
}

window.addEventListener("load", getCurrentImageOfTheDay);
