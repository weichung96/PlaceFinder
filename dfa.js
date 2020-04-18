var patterns = [];
var states = [];
var alphabets = [];
var initial = "0";
var final = [];
var TF = new Array();
var ascii_codes = 256;
var lines = [];

defaultSetting();

function defaultSetting() { //This function is used to define DFA by default to 
    patterns = ["Malaysia", "Australia", "Penang", "Pizza Hut", "Intel"];
    states = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"];
    alphabets = ["M", "a", "l", "y", "s", "i", "A", "u", "t", "r", "P", "e", "n", "g", "z", " ", "H", "I"];
    initial = "0";
    final = ["17", "22", "30", "34"];

    document.getElementById("patterns").value = patterns.join(',');
    document.getElementById("states").value = states.join(',');
    document.getElementById("alphabets").value = alphabets.join(',');
    document.getElementById("initial_state").value = initial;
    document.getElementById("final_state").value = final.join(',');

    //Initialize Transition Array 
    var Uppercases = ["M", "A", "P", "I"];
    for (state = 0; state < states.length; state++) {
        TF[state] = new Array(ascii_codes);
        for (x = 0; x < ascii_codes; x++) {
            var letter = String.fromCharCode(x);
            if (Uppercases.includes(letter)) {
                var value = Uppercases.indexOf(letter) + 1;
                TF[state][x] = value.toString();
            } else {
                TF[state][x] = "0";
            }
        }
    }

    //Define transition function in 2D array
    TF[1][97] = "5"; // 1->5 if "a"
    TF[2][117] = "10"; // 2->10 if "u"
    TF[3][105] = "23"; // 3->23 if "i"
    TF[3][101] = "18"; // 3->18 if "e"
    TF[4][110] = "31"; // 4->31 if "n"
    TF[5][108] = "6"; // 5->6 if "l"
    TF[6][97] = "7"; // 6->7 if "a"
    TF[7][121] = "8"; // 7->8 if "y"
    TF[8][115] = "9"; // 8->9 if "s"
    TF[9][105] = "16"; // 9->16 if "i"
    TF[10][115] = "11"; // 10->11 if "s"
    TF[11][116] = "12"; // 11->12 if "t"
    TF[12][114] = "13"; // 12->13 if "r"
    TF[13][97] = "14"; // 13->14 if "a"
    TF[14][108] = "15"; // 14->15 if "l"
    TF[15][105] = "16"; // 15->16 if "i"
    TF[16][97] = "17"; // 16->17 if "a"
    TF[18][110] = "19"; // 18->19 if "n"
    TF[19][97] = "20"; // 19->20 if "a"
    TF[20][110] = "21"; // 20->21 if "n"
    TF[21][103] = "22"; // 21->22 if "g"
    TF[23][122] = "24"; // 23->24 if "z"
    TF[24][122] = "25"; // 24->25 if "z"
    TF[25][97] = "26"; // 25->26 if "a"
    TF[26][32] = "27"; // 26->27 if "space"
    TF[27][72] = "28"; // 27->28 if "H"
    TF[28][117] = "29"; // 28->29 if "u"
    TF[29][116] = "30"; // 29->30 if "t"
    TF[31][116] = "32"; // 31->32 if "n"
    TF[32][101] = "33"; // 32->33 if "e"
    TF[33][108] = "34"; // 33->34 if "l"

    for (i = 0; i < final.length; i++) {
        for (x = 0; x < ascii_codes; x++) {
            TF[final[i]][x] = final[i];
        }
    }

    displayTable(); //This is just a function to display transition table in Html
}

//This function is used to create finite set of input symbol exist from the strings or patterns 
function createAlphabet() {
    if (alphabets.length > 0) {
        alphabets = [];
    }

    var strings = document.getElementById("patterns").value.split(",");

    for (str = 0; str < strings.length; str++) {
        var chars = strings[str].split("");
        for (char = 0; char < chars.length; char++) {
            if (alphabets.indexOf(chars[char]) === -1) {
                alphabets.push(chars[char]);
            }
        }
    }

    document.getElementById("alphabets").value = alphabets;
    createTable();
}

//This function is used to recreate transition table when input setting of string, states and symbols is changed.
function createTable() {
    states = document.getElementById("states").value.split(",");
    if (states.length > 0) {
        document.getElementById("initial_state").value = states[0];
        initial = states[0];
    }

    alphabets = document.getElementById("alphabets").value.split(",");

    //Re-initialize the transition array that move from states back to state "0" for every symbols in ascii table
    for (state = 0; state < states.length; state++) {
        TF[state] = new Array(ascii_codes);
        for (x = 0; x < ascii_codes; x++) {
            TF[state][x] = "0";
        }
    }

    displayTable(); //This is just a function to display transition table in Html
}

//This is just a function to display transition table in Html
function displayTable() {
    var table = document.getElementById("transition_table");
    while (table.hasChildNodes()) {
        table.removeChild(table.childNodes[0]);
    }
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");

    //Create table header
    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Q∑"));
    thead.appendChild(th);
    for (var i = 0; i < alphabets.length; i++) {
        var th = document.createElement("th");
        if (alphabets[i] == " ") {
            var column = '"space"';
        } else {
            var column = alphabets[i];
        }
        th.appendChild(document.createTextNode(column));
        thead.appendChild(th);
    }
    //Create table data
    for (var i = 0; i < states.length; i++) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cellText = document.createTextNode(states[i]);
        cell.appendChild(cellText);
        row.appendChild(cell);

        for (var j = 0; j < alphabets.length; j++) {
            var cell = document.createElement("td");
            var cellInput = document.createElement("input");
            cellInput.value = TF[i][alphabets[j].charCodeAt()];
            cellInput.size = 1;
            cellInput.setAttribute("type", "text");
            cellInput.id = 'TF[' + i + '][' + alphabets[j].charCodeAt() + ']';
            cell.append(cellInput);
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
    table.append(thead);
    table.append(tbody);
}

//Read text file
document.getElementById("openFile").addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        lines = this.result.replace(/\n\s*\n/g, '.').split('.');
        var text = fr.result;
        document.getElementById('text').innerText = text;
    }
    fr.readAsText(this.files[0]);
});

//Search in transition function (TF) array to find next state by given current state and symbol 
function search(state, character) {
    return TF[states.indexOf(state)][character.charCodeAt()];
}

function runDFA() {

    var occurrences = {};
    var result = [
        [
            []
        ]
    ];

    initial = document.getElementById("initial_state").value;
    final = document.getElementById("final_state").value.split(",");

    $('#needle').html("");
    $('#haystack').html("");
    $('#occurence').html("");
    $('#position').html("");
    $('#demostration').html("");

    patterns = document.getElementById("patterns").value.split(",");
    var needle = document.getElementById("patterns").value;
    $('#needle').html('<strong>The pattern (needle): </strong>' + needle);

    //For occurance count
    for (var i = 0; i < patterns.length; i++) {
        occurrences[patterns[i]] = 0;
    }
    //For position
    result = new Array(lines.length);
    for (var line = 0; line < lines.length; line++) {
        result[line] = new Array(patterns.length);
        for (p = 0; p < patterns.length; p++) {
            result[line][p] = new Array(0);
        }
    }

    //create transition function from user inputs
    for (i = 0; i < states.length; i++) {
        for (j = 0; j < alphabets.length; j++) {
            var next_states = document.getElementById("TF[" + i + "][" + alphabets[j].charCodeAt() + "]").value;
            if (next_states.length > 0) { //There might be more than one next state for different symbols
                next_states = next_states.split(',');
                for (s = 0; s < next_states.length; s++) {
                    TF[i][alphabets[j].charCodeAt()] = next_states[s];
                }
            }
        }
    }

    var demo = document.getElementById("demostration");
    var demo_text = "<h5 style='color:blue;'><strong>Demostration</strong></h5>";

    for (var line = 0; line < lines.length; line++) {
        lines[line] = lines[line].trim();
        lines[line] = lines[line].replace(/ +(?= )/g, '');

        var chars = lines[line].split("");

        var current_state = initial;

        //This 4 variables are used for demonstration's part
        var transition = "0";
        var substrings = [];
        var haystack = lines[line];
        var status = "Rejected";

        for (i = 0; i < chars.length; i++) { //process one character at a time
            var next_state = search(current_state, chars[i]);

            if (final.includes(next_state)) {
                var pattern = "";
                var reverse_state = next_state;
                for (var r = i; r >= 0; r--) { //This for loop is just used to make bold of substring found
                    for (q = 0; q < states.length; q++) {
                        if (TF[q][chars[r].charCodeAt()] == reverse_state) {
                            var colIndex = 0;
                            TF.findIndex((row) => {
                                var foundColIndex = row.indexOf(q.toString());
                                if (foundColIndex !== -1) {
                                    colIndex = foundColIndex;
                                    return true;
                                }
                            });
                            if (q.toString() == "0" || colIndex.toString() == chars[(r - 1)].charCodeAt()) {
                                reverse_state = q.toString();
                                pattern = chars[r] + pattern;
                                break;
                            }
                        }
                    }
                    if (reverse_state == "0") {
                        break;
                    }
                }

                //For position
                var index = i - pattern.length + 1;
                if (result[line][patterns.indexOf(pattern)].indexOf(index) === -1) {
                    result[line][patterns.indexOf(pattern)].push(index);
                }

                //For occurrence count
                occurrences[pattern] = occurrences[pattern] + 1;

                //For demostration's part
                if (substrings.indexOf(pattern) === -1) {
                    substrings.push(pattern);
                }
                status = "Accepted";

                transition += "-->" + next_state;
                // current_state = next_state;
                current_state = "0";
            } else {
                transition += "-->" + next_state;
                current_state = next_state;
            }
        }

        if (chars.length > 0) {
            demo_text += "<br><strong>Transition:</strong> " + transition;
            demo_text += "<br><strong>Needles:</strong> " + patterns.join(",");
            demo_text += "<br><strong>Haystack:</strong> " + haystack + ".";
            demo_text += "<br><strong>Status:</strong> " + status + "<br>";
            if (substrings.length > 0) {
                demo_text += "<strong>Substring found:</strong> " + substrings.join(",") + "<br>";
            }

            for (p = 0; p < substrings.length; p++) {
                var reg = new RegExp(substrings[p], "g");
                lines[line] = lines[line].replace(reg, "<mark>" + substrings[p] + "</mark>");
            }
        }
    }

    demo.innerHTML = demo_text;

    var new_text = document.getElementById("haystack");
    var p = document.createElement("P");
    p.innerHTML = "<strong>The text (haystack): </strong><br>";
    new_text.appendChild(p);

    //This part is to print text with substrings hightlighted in line by line
    for (var line = 0; line < lines.length; line++) {
        if (line == lines.length - 1) {
            break;
        }
        if (lines[line].charAt(0) == " ") {
            var p = document.createElement("p");
            p.innerHTML = (line + 1) + ":" + lines[line] + '.<br>';
            new_text.appendChild(p);
        } else if (lines[line].trim() === "") {
            var p = document.createElement("p");
            p.innerHTML = (line + 1) + ":" + lines[line] + '<br>';
            new_text.appendChild(p);
        } else {
            var p = document.createElement("p");
            p.innerHTML = (line + 1) + ": " + lines[line] + '.<br>';
            new_text.appendChild(p);
        }
    }

    //This part prints the count of occurrence for each substring
    var occurence_text = "<h5 style='color:blue;'><strong>Occurences</strong></h5>";
    for (var key in occurrences) {
        occurence_text += key + " : " + occurrences[key] + " founds<br>";
    }
    document.getElementById("occurence").innerHTML = occurence_text;

    //This part prints the position of each substring found
    var position_text = "<h5 style='color:blue;'><strong>Position</strong></h5>";
    for (var p = 0; p < patterns.length; p++) {

        if (occurrences[patterns[p]] > 0) {
            position_text += patterns[p] + " is found at position:";
            for (var line = 0; line < lines.length; line++) {
                if (result[line][p].length > 0) {
                    position_text += "<br> line : " + (line + 1) + " and index : " + result[line][p].join(",");
                }
            }
            position_text += "<br><br>";
        } else {
            position_text += patterns[p] + " is found at position: - <br><br>";
        }
    }
    document.getElementById("position").innerHTML = position_text;

}

//Clear input and result to re-define new DFA
function clear_input() {
    document.getElementById("patterns").value = "";
    document.getElementById("states").value = "";
    document.getElementById("alphabets").value = "";
    document.getElementById("initial_state").value = "";
    document.getElementById("final_state").value = "";

    table = document.getElementById("transition_table");
    table.innerHTML = "";

    document.getElementById("openFile").value = "";
    document.getElementById("text").innerHTML = "";


    $('#needle').html("");
    $('#haystack').html("");
    $('#occurence').html("");
    $('#position').html("");
    $('#demostration').html("");
}