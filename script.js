// VARIABLES //

// QUERYSELECTORS / GETELEMENTSBYID //

//Dynamically change background of case_file´s case_summary
const backgroundCaseSummary = document.querySelector(".case_summary");
const login_form = document.querySelector("#login_form");

//Fields
const backgroundsArray = [
    "images/case_file_background_office_water.png",
    "images/case_file_background_in_office.png",
    "images/case_file_background_cityscape.png",
    "images/background_case_file.png"
];

//Functioncalls
if (backgroundCaseSummary) {
    randomizeBackground(backgroundsArray, backgroundCaseSummary);
}

// METHODS / FUNCTIONS //

// Randomizer of backgrounds for file_case    

function randomizeBackground(array, element) {
    const randomBackground = array[Math.floor(Math.random() * array.length)];

    element.style.backgroundImage = `url("${randomBackground}")`;
}

//Loggin
login_form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.replace("desktop.html");
});