//Forces the browser to scroll down. Used when the window is too big.
/*setInterval(function () {
    window.scrollTo(0, document.body.scrollHeight);
}, 100);*/

// VARIABLES + ARRAYS //
// QUERYSELECTORS / GETELEMENTSBYID //

const terminalOutputList = document.querySelector("#terminal_output_list");
const terminalInput = document.querySelector("#terminal_input");
const terminalWindow = document.querySelector("#terminal_window");
const closeTerminalButton = document.querySelector("#close_terminal");


/* "help", "about", "clear","date", "projects", "contact" */

const COMMANDS = {
    CLS: "cls",
    CD_DOWN: "cd ",
    CD_UP: "cd..",
    DIR: "dir",
    HELP: "help",
    TYPE: "type",
    RUN: "exe"
};

const commands = [
    {
        id: 0,
        name: "help",
        description: "this command will help you with things",
        command: "help"
    }, {
        id: 1,
        name: "type",
        description: "this command allows you to run a text-file",
        command: "type"
    }, {
        id: 2,
        name: "cls",
        description: "this command will clear all the text you´ve written",
        command: "cls"
    }, {
        id: 3,
        name: "change directory",
        description: "this command will change directory",
        command: "cd"
    },
    {
        id: 4,
        name: "change directory down",
        description: "this command will change directory and go down in the hirarchy",
        command: "cd.."
    },
    {
        id: 5,
        name: "directory",
        description: "this command will list the directory",
        command: "dir"
    }
];

let currentDirectoryPath = "c:";

const fileTree = {
    "c:": {
        Users: {
            fredrik: {
                desktop: {
                    "notes.txt": "This is a long text about nothing!",
                    "case_file.txt": [
                        "Page 1: This is page one",
                        "Page 2: This is the second page",
                        "Page 3: This is the third page"
                    ]
                }
            },
            secret: {

            }
        },
        "Program Files": {
            Google: {

            },
            "Internet Explorer": {

            },
            "Common Files": {

            }
        },
        "Program Files (x86)": {

        },
        Windows: {
            System32: {
                "cmd.exe": {
                    description: "Opens a command-line window.",
                    action: ["Open", "cmd"]
                },
                "notepad.exe": {
                    description: "Opens Notepad.",
                    action: ["Open", "notepad"]
                }
            },
            Temp: {

            },
            "explorer.exe": {
                description: "Opens File Explorer or starts the Windows shell.",
                action: ["Open", "explorer"]
            },
            "regedit.exe": {
                description: "Opens the Windows Registry Editor.",
                action: ["Open", "regedit"]
            }
        },
        ProgramData: {

        }
    }
}

const terminalHistory = [
    {
        id: 0,
        currentDirectoryPath: "c:",
        command: "",
        input: ""
    }
];

//printTerminal(terminalHistory);
renderTerminalHistory(terminalHistory);
/*
terminalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (terminalInput.value.length === 0) return;

        addPromptEventToHistory(terminalInput);
        terminalInput.value = "";
    }
});
*/

function addPromptEventToHistory(input) {
    let historyObject = {
        id: terminalHistory.length,
        currentDirectoryPath: currentDirectoryPath,
        input: input.value
    };

    input.remove();

    terminalHistory[terminalHistory.length - 1] = historyObject;

    renderTerminalHistory(terminalHistory);
    parseString(input.value);
}

function addToHistory(row = "", command) { // TO ADD TO HISTORY THAT`S NOT A DIRECT INPUt
    const historyObject = {
        id: terminalHistory.length,
        currentDirectoryPath: currentDirectoryPath,
        command: command,
        input: row
    };

    terminalHistory.push(historyObject);

    renderTerminalRow(historyObject, command);
}

/* Renders the whole history */
function renderTerminalHistory(history, command) {
    terminalOutputList.innerHTML = "";

    history.forEach((row, index) => {
        let outputLi = document.createElement("li");

        if (row.command == COMMANDS.DIR || row.command == COMMANDS.HELP) {
            outputLi.textContent = row.input;
        } else {
            outputLi.textContent = row.currentDirectoryPath + "\\>" + row.input;
        }


        // Only the last empty row gets an input field
        if (index === history.length - 1 && row.input === "") {
            let input = document.createElement("input");

            input.setAttribute("aria-label", "terminal input");
            input.setAttribute("type", "text");
            input.classList.add("terminal_input");

            addEventListener(input);

            outputLi.appendChild(input);

            input.focus();
        }
        /* add css with classlist */
        terminalOutputList.appendChild(outputLi);
    });
}

/* Renders the newly written row */
function renderTerminalRow(row, command) {
    let outputLi = document.createElement("li");

    if (command == COMMANDS.DIR || command == COMMANDS.HELP) {
        outputLi.textContent = row.input;
    } else {
        outputLi.textContent = row.currentDirectoryPath + "\\>" + row.input;
    }

    if (row.input === "") {
        let input = document.createElement("input");

        input.setAttribute("aria-label", "terminal input");
        input.classList.add("terminal_input");

        addEventListener(input);

        outputLi.appendChild(input);
        input.focus();
    }

    terminalOutputList.appendChild(outputLi);
}

function addEventListener(input) {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (input.value.length === 0) return;

            addPromptEventToHistory(input);
            input.value = "";
        }
    });
}

function parseString(string) {
    const input = string.toLowerCase().trim();
    const extention = input.split(".").pop();

    let commandFound = false;

    /* if (extention === COMMANDS.RUN) {
         commandFound = true;
         runFile(input, COMMANDS.RUN);
         return;
     }*/

    commands.forEach((command) => {
        if (input === command.command || input.startsWith(command.command + " ")) {
            commandFound = true;
            if (input === COMMANDS.CD_UP) {
                changeDirectory("", COMMANDS.CD_UP);
            } else if (input.startsWith(COMMANDS.CD_DOWN)) {
                const folder = input.slice(3);

                if (folder.length >= 1) {
                    changeDirectory(folder, COMMANDS.CD_DOWN);
                }
            } else if (input === COMMANDS.CLS) {
                console.log("in cls");
            } else if (input === COMMANDS.DIR) {
                listDirectory(COMMANDS.DIR);
            } else if (input === COMMANDS.HELP) {
                help();
            } else if (input.startsWith(COMMANDS.TYPE)) {
                const file = input.slice(5);
                console.log("file: " + file);
                if (file.length >= 1) {
                    readFile(file, COMMANDS.TYPE);
                }
            }
        }
    });

    if (!commandFound && extention === COMMANDS.RUN) {
        commandFound = true;
        runFile(input, COMMANDS.RUN);
    }

    if (!commandFound) {
        addToHistory();
    }
}

function readFile(file, commandMode) {
    console.log("readfile " + file + " " + commandMode);
    navigateFileSystem(fileTree, null, file, null, commandMode);
    addToHistory();
}

function runFile(file, commandMode) {
    navigateFileSystem(fileTree, null, file, null, commandMode);
    addToHistory();
}

function help() {
    console.log("in help-function");
    commands.forEach((command, index) => {
        addToHistory(command.id + ". " + command.command.toUpperCase() + ", " + command.description, COMMANDS.HELP);
    });
    addToHistory();
}

function changeDirectory(targetDirectoryName, commandMode) {
    const oldDirectoryPath = currentDirectoryPath;

    if (commandMode === COMMANDS.CD_UP &&
        currentDirectoryPath === "c:"
    ) {
        addToHistory();
        console.log("changeDirectory if");
        return;
    }

    navigateFileSystem(fileTree, null, targetDirectoryName, null, commandMode);

    if (
        commandMode === COMMANDS.CD_DOWN &&
        currentDirectoryPath === oldDirectoryPath
    ) {
        addToHistory();
    }
}

function listDirectory(navMode) {
    navigateFileSystem(fileTree, null, null, "", navMode);
}

function navigateFileSystem(
    currentFolderContents, /* What is inside the current folder */
    parentFolderName = null, /* Name of the folder above */
    targetName, /* Folder/file we want to find/use */
    parentFolderPath = null, /* Path to the folder above */
    commandMode = null /* 1 = go down in new dir, 0 = go back up in prev dir, 2 = list directory */
) {
    //En rekursiv funktion/metod som rekursivt går igenom "directoriet" =
    // ett fält av objekt och variabler (som representerar värdena i).

    const folderEntries = Object.entries(currentFolderContents); //Skapar ett directory att loopa igen

    //name = nycklen/"key:n", value = värdet i den. Varje key har ett värde.
    folderEntries.forEach(([folderName, folderContents]) => {

        //En if-sats som kollar om värdet/value är:
        // 1. av TYPEN OBJEKT,
        // 2. det INTE är NULL
        // 3. och INTE är ett FÄLT/en ARRAY.
        if (typeof folderContents === "object" &&
            folderContents != null) {

            //Skapar här en ny variable med namnet newPath för att skapa den nya
            // pathen och samtidigt "spara" den gamla pathen
            // (behövs för att kunna skicka med när funktionen/metoden
            // rekursivt går igenom directoriet).

            let currentFolderPath; // Full path to the folder we are checking

            if (parentFolderPath) {
                currentFolderPath = parentFolderPath + "\\" + folderName;
            } else {
                currentFolderPath = folderName;
            }

            //const directoryTree = currentPath ? currentPath + "\\" + name : name;

            /*if (currentDirectory === name && parent !== null) {
                console.log("Has currentDirectory " + currentDirectory + " " + name);
            } else {
                console.log("Has no currentdirectory");
            }*/

            if (commandMode === COMMANDS.CD_DOWN) {
                if (
                    targetName === folderName.toLowerCase().trim() &&
                    parentFolderPath === currentDirectoryPath
                ) {
                    currentDirectoryPath = currentFolderPath;

                    addToHistory(); // TOM RAD = NY PROMPT
                }
            } else if (commandMode === COMMANDS.CD_UP) {
                console.log(" folderEntries.forEach");
                if (
                    currentFolderPath === currentDirectoryPath &&
                    parentFolderPath !== ""
                ) {
                    currentDirectoryPath = parentFolderPath;

                    addToHistory(); // TOM RAD = NY PROMPT
                }
            } else if (commandMode === COMMANDS.DIR) {
                if (currentFolderPath === currentDirectoryPath) {
                    addToHistory("\n Volume in drive C is Windows-SSD \n Volume Serial Number is 0A4B-C164\n\n" +
                        " Directory of " + currentDirectoryPath + "\n\n", COMMANDS.DIR);
                    Object.keys(folderContents).forEach((itemsName) => {
                        addToHistory(" " + getCurrentDateTime() + " " + itemsName, COMMANDS.DIR);
                    });
                    addToHistory();
                }
            } else if (
                commandMode === COMMANDS.TYPE &&
                targetName !== ""
            ) {
                Object.keys(folderContents).forEach((itemsName) => {
                    const extention = targetName.split(".").pop();
                    if (itemsName === targetName && extention === "txt") {
                        if (Array.isArray(folderContents[itemsName])) {
                            addToHistory("\n File: " + targetName + "\n " + folderContents[itemsName].join("\n "));
                        } else {
                            addToHistory("\n File: " + targetName + "\n " + folderContents[itemsName]);
                        }
                        return true;
                    }
                });
            } else if (
                commandMode == COMMANDS.RUN &&
                targetName !== ""
            ) {
                Object.keys(folderContents).forEach((itemsName) => {
                    const extention = targetName.split(".").pop();
                    if (itemsName === targetName && extention === "exe") {
                        console.log("found " + targetName);
                        console.log("itemsName.description: " + folderContents[itemsName].description);
                        if (folderContents[itemsName].action[0].toLowerCase() === "open") {

                            let program = folderContents[itemsName].action[1].toLowerCase();
                            if (program === "notedpad" || program === "cmd" || program === "explorer" || program === "regedit") {
                                console.log("in if: " + program);

                                executeProgram(program);
                            }
                        }
                    } else {
                        console.log("could not find");
                    }
                });
            }
            /*                               console.log("____________");
                                console.log("1. folderContents: ", folderContents);
            
                                console.log("2. currentFolderPath: " + currentFolderPath);
                                console.log("3. currentDirectoryPath: " + currentDirectoryPath);
            */
            //Utskrifter i loopen/rekursionen
            /* console.log("1.currentDirectoryPath (där jag 'står' nu): " + currentDirectoryPath);
                console.log("targetDirectoryName: " + targetDirectoryName); //Visar målfoldern
                console.log("2.directoryName (Nuvarande mapp I LOOPEN):", directoryName);
                console.log("3.parentDirectoryName (föräldermappen - || -):", parentDirectoryName);
                console.log("5.currentPath (nuvarande sökväg - || -): " + currentLoopPath);
                console.log("5.parentPath (föregående sökväg - || -): " + parentLoopPath);
            */

            //Directory trädet, parent, target Directory Name, nuvarande path
            navigateFileSystem(
                folderContents,
                folderName,
                targetName,
                currentFolderPath,
                commandMode
            ); //rekursiv loop som går igenom nästa steg av fältet av objekts
        }
    });
}

function executeProgram(program) {

    if (program === "notedpad") {
        popup.classList.add("show");
    } else if (program === "cmd") {
        popup.classList.add("show");
    } else if (program === "explorer") {
        popup.classList.add("show");
    } else if (program === "regedit") {
        popup.classList.add("show");
    }
}



//Used when printing a directory
function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const dateTime = `${year} - ${month}-${day} ${hours}:${minutes}`;

    return String(dateTime);
}

closeTerminalButton.addEventListener("click", () => {
    terminalWindow.classList.add("close");
    event.preventDefault();
    window.location.replace("desktop.html");
})

closeTerminalButton.addEventListener("click", () => {
    terminalWindow.classList.add("close");
    event.preventDefault();
    window.location.replace("desktop.html");
})