//Dynamically change background of case_file´s case_summary
const backgroundCaseSummary = document.querySelector(".case_summary");

const people =
    [
        [
            {
                id: Math.floor(Math.random() * 100) + 1,
                name: "Lisa",
                age: 14,
                town: "Stockholm"
            },
            {
                id: Math.floor(Math.random() * 100) + 1,
                name: "Juan",
                age: 20,
                town: "Stockholm"
            },
            {
                id: Math.floor(Math.random() * 100) + 1,
                name: "Robert",
                age: 14,
                town: "Stockholm"
            }
        ],
        [
            {
                id: Math.floor(Math.random() * 100) + 1,
                name: "Saga",
                age: 20,
                town: "Stockholm"
            }
            , {
                id: Math.floor(Math.random() * 100) + 1,
                name: "Saga",
                age: 20,
                town: "Stockholm"
            }
        ]
    ];

people.forEach((person) => {
    person.forEach((person) => { console.log(person.id + ". " + person.name); });

});

const backgroundsArray = [
    "images/case_file_background_office_water.png",
    "images/case_file_background_in_office.png",
    "images/case_file_background_cityscape.png",
    "images/background_case_file.png"
];

randomizeBackground(backgroundsArray, backgroundCaseSummary);

function randomizeBackground(array, element) {
    const randomBackground = array[Math.floor(Math.random() * array.length)];

    element.style.backgroundImage = `url("${randomBackground}")`;
}
