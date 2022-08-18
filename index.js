// for restoring the home page after searching
let body = document.querySelector(".main_content_header");
const lastHeader = body.cloneNode(true);
body = document.querySelector(".courses_section");
const lastCourses = body.cloneNode(true);
body = document.querySelector(".students_viewing_section");
const lastStudents = body.cloneNode(true);
body = document.querySelector(".categories");
const lastCategories = body.cloneNode(true);
//===================================================
// bring data
fetch("https://mocki.io/v1/e65cdce3-bbfa-4c52-bcbe-169775dd3ba5")
  .then((response) => {
    return response.json();
  })
  .then((arr) => {
    myData = arr;
    for (let i = 0; i < arr[0]["courses"].length; i++) {
      createCoursesSection(arr[0]["courses"][i]);
    }
    activate(0);
    update(0);
  });
// myData is storing the fetch return
let myData = [];
// the targeted data from search
let wantedData = [];
// holding the main content to override it
let mContent = document.querySelector(".main_content");
// results container should hold the header and results section
let resultsContainer = document.createElement("div");
resultsContainer.classList.add("search_container");
// search page's header that showing the number of results and back button
let searchHeader = document.createElement("header");
searchHeader.classList.add("results_header");
let backBtn = document.createElement("button");
backBtn.classList.add("back_btn");
backBtn.innerText = "Back";
// creating results section
let coursesSection = document.createElement("section");
coursesSection.classList.add("results_section");
// grapping the search bar input and search button
let searchBar = document.getElementById("my_search_bar");
let searchBtn = document.getElementById("search_btn");

// activating the "Enter" to search
searchBar.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// start search using search button
searchBtn.addEventListener("click", () => {
  // if user tried to search without entering any data
  if (searchBar.value === "") {
    alert("you didn't enter any thing");
  } else {
    //removing every thing from home page to start the search page
    mContent.innerHTML = "";
    resultsContainer.innerHTML = "";
    searchHeader.innerHTML = "";
    coursesSection.innerHTML = "";
    // holding search input
    let key = searchBar.value;
    //taking the last targeted elements away to start a new search operation
    wantedData = [];
    // a function that appends matches to the wantedData array
    filter(key);
    let resultsNumber = document.createElement("h1");

    if (wantedData.length === 0) {
      // when no result found
      resultsNumber.innerText = `Sorry, we couldn't find any results for "${key}"`;
      searchHeader.appendChild(resultsNumber);
      searchHeader.appendChild(backBtn);
      resultsContainer.appendChild(searchHeader);
    } else {
      resultsNumber.innerText = `${wantedData.length} results for "${key}"`;
      searchHeader.appendChild(resultsNumber);
      searchHeader.appendChild(backBtn);
      resultsContainer.appendChild(searchHeader);
    }
    // rendering the results into the search section
    for (let i = 0; i < wantedData.length; i++) {
      createCoursesSearch(wantedData[i]);
    }
    resultsContainer.appendChild(coursesSection);
    //then pushing the results section to the main content
    mContent.appendChild(resultsContainer);
  }
});

function filter(key) {
  wantedData = [];
  for (let i = 0; i < myData.length; i++) {
    for (let j = 0; j < myData[i]["courses"].length; j++) {
      reg = new RegExp(key, "ig"); //creating pattern
      if (myData[i]["courses"][j]["title"].match(reg))
        // check if the key in the course title
        wantedData.push(myData[i]["courses"][j]);
    }
  }
}
// creating container for course and push it into results section
function createCoursesSearch(courseData) {
  //to make the hole card act like link
  let link = document.createElement("a");
  link.classList.add("card_anchor");
  link.setAttribute("href", "/");
  //======================================
  //the card container
  let container = document.createElement("div");
  container.classList.add("course_card_for_search");
  //================================
  //image container
  let courseImg = document.createElement("div");
  courseImg.classList.add("card_photo");
  let img = document.createElement("img");
  img.setAttribute("src", courseData["image"]);
  img.classList.add("search_reuslt_img");
  //=======================================
  // main information about the card
  let courseInfo = document.createElement("div");
  courseInfo.classList.add("card_info");
  let title = document.createElement("h3"); // title
  title.style.fontWeight = "700";
  title.style.marginBottom = "8px";
  title.innerText = courseData.title;
  let author = document.createElement("p"); // author
  author.classList.add("course_author", "search_author");
  author.innerText = courseData.author[0]["name"];
  let description = document.createElement("p"); // description
  description.classList.add("course_description_search");
  description.innerText = courseData.headline;
  let rate = document.createElement("div"); // rate
  rate.classList.add("rate");
  // handling the rate with icons
  rate.innerText = Math.round(courseData["rating"] * 10) / 10 + " "; // taking one digit after decimal point
  let starsArr = [];
  for (let i = 1; i <= Math.round(courseData["rating"]); i++) {
    starsArr[i] = document.createElement("i");
    starsArr[i].classList.add("fa-solid", "fa-star");
    rate.appendChild(starsArr[i]);
  }
  //==========================================
  // the price of course and discount
  let priceDv = document.createElement("div");
  priceDv.classList.add("card_price");
  let price = document.createElement("h3");
  price.innerText = courseData["price"] + " $";
  let sale = document.createElement("h3");
  sale.classList.add("sale");
  sale.innerText = "35.99 $";
  //========================================
  courseImg.appendChild(img);
  courseInfo.appendChild(title);
  courseInfo.appendChild(description);
  courseInfo.appendChild(author);
  courseInfo.appendChild(rate);
  priceDv.appendChild(price);
  priceDv.appendChild(sale);
  container.appendChild(courseImg);
  container.appendChild(courseInfo);
  container.appendChild(priceDv);
  link.appendChild(container);
  coursesSection.appendChild(link);
  //
  let hr = document.createElement("hr");
  coursesSection.appendChild(hr);
}
// to go back from results page to the home page
backBtn.addEventListener("click", () => {
  searchBar.value = "";
  mContent.innerHTML = "";
  // mentioned above
  mContent.appendChild(lastHeader);
  mContent.appendChild(lastCourses);
  mContent.appendChild(lastStudents);
  mContent.appendChild(lastCategories);
});
//the ul element we are going to append in based on explore nav bar selection
let  coursesList= document.querySelector(".courses_explorer");
coursesList.classList.add("swiper-wrapper");
let card = document.querySelector(".courses_secondary_container");

/*
making buttons in explore nav bar alive
*/
// holding the head line and description of every category
let head_line = document.querySelector(".head_line");
let short_explination = document.querySelector(".short_explination");
////////////////////////////////
// holding all buttons in array to set its color value to default then change the targeted one
let all = document.querySelectorAll(".click");

// setting event for all buttons
for (let index = 0; index < all.length; index++) {
  all[index].addEventListener("click", () => {
    activate(index);
    update(index);
  });
}

// changing the color of all buttons except for the targeted one
function activate(index) {
  for (let i = 0; i < all.length; i++) 
  all[i].style.color = "gray";
  all[index].style.color = "black";
}
// rendering the changes 
function update(index) {
  head_line.innerHTML = myData[index].sectionTitle;
  short_explination.innerHTML = myData[index].courseDesc;
  
  coursesList.innerHTML = "";
  for (let j = 0; j < myData[index]["courses"].length; j++) {
    createCoursesSection(myData[index]["courses"][j]);
  }
  // putting every thing 
  let swipe = buildSwiper();
  swipe.appendChild(coursesList);
  let swiper = new Swiper(swipe, {
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 4,
    loop: false,
    loopFillGroupWithBlank: false,
    allowTouchMove: false,
    navigation: {
      nextEl: swipe.querySelector(".swiper-button-next"),
      prevEl: swipe.querySelector(".swiper-button-prev"),
    },
    breakpoints: {
      1280: {
        slidesPerView: 5,
        slidesPerGroup: 4,
        spaceBetween: 20,
      },
      1100: {
        slidesPerView: 4,
        slidesPerGroup: 3,
        spaceBetween: 20,
      },
      890: {
        slidesPerView: 3,
        slidesPerGroup: 2,
        spaceBetween: 20,
      },
      550: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 20,
      },
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
    },
  });
  card.appendChild(swipe);
  
}

// rendering the course into the courses section
function createCoursesSection(courseData) {
  let cardContainer = document.createElement("div");
  cardContainer.classList.add("card_container", "swiper-slide");
  let photoContainer = document.createElement("div");
  photoContainer.classList.add("course_photo");
  let img = document.createElement("img");
  img.setAttribute("src", courseData.image);
  photoContainer.appendChild(img);
  cardContainer.appendChild(photoContainer);
  let title = document.createElement("div");
  title.classList.add("course_decription");
  title.innerText = courseData.title;
  cardContainer.appendChild(title);
  let author = document.createElement("div");
  author.classList.add("course_author");
  author.innerText = courseData["author"][0]["name"];
  cardContainer.appendChild(author);
  let rate = document.createElement("div");
  rate.classList.add("rate");
  rate.innerText = Math.round(courseData["rating"] * 10) / 10 + " ";
  let starsArr = [];
  for (let i = 1; i <= Math.round(courseData["rating"]); i++) {
    starsArr[i] = document.createElement("i");
    starsArr[i].classList.add("fa-solid", "fa-star");
    rate.appendChild(starsArr[i]);
  }
  cardContainer.appendChild(rate);
  let price = document.createElement("div");
  price.classList.add("course_price");
  price.innerText = courseData["price"] + " $";
  cardContainer.appendChild(price);
  //link.appendChild(cardContainer);
  coursesList.appendChild(cardContainer);
  
}

  function buildSwiper() {
  let swipper = document.createElement("div");
  swipper.classList.add("swiper");
  let nextButton = document.createElement("div");
  nextButton.classList.add("swiper-button-next");
  let prevButton = document.createElement("div");
  prevButton.classList.add("swiper-button-prev");
  swipper.appendChild(prevButton);
  swipper.appendChild(nextButton);
  return swipper;
}
