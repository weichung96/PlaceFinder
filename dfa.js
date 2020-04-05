var states = [];
var alphabets = [];
var initial = "0";
var final = [];
var NO_OF_CHARS = 256;
var TF = new Array();
var patterns = [];
var lines = [];
var Uppercases = [];

function createAlphabet() {
    if (alphabets.length > 0) {
        alphabets = [];
    }
    Uppercases = [];

    var strings = document.getElementById("patterns").value.split(",");

    for (str = 0; str < strings.length; str++) {
        if (strings[str].match(/[A-Z]/)) {
            if (Uppercases.indexOf(strings[str][0]) === -1) {
                Uppercases.push(strings[str][0]);
            }
        }
        var chars = strings[str].split("");
        for (char = 0; char < chars.length; char++) {
            // if (chars[char].match(/[A-Z]/g)) {
            //     if (Uppercases.indexOf(chars[char]) === -1) {
            //         Uppercases.push(chars[char]);
            //     }
            // }
            if (alphabets.indexOf(chars[char]) === -1) {
                alphabets.push(chars[char]);
            }
        }
    }

    // console.log(Uppercases);

    document.getElementById("alphabets").value = alphabets;
    createTable();
}

function createTable() {
    states = document.getElementById("states").value.split(",");
    if (states.length > 0) {
        document.getElementById("initial_state").value = states[0];
        initial = states[0];
    }

    alphabets = document.getElementById("alphabets").value.split(",");

    for (state = 0; state < states.length; state++) {
        TF[state] = new Array(NO_OF_CHARS);
        for (x = 0; x < NO_OF_CHARS; x++) {
            var letter = String.fromCharCode(x);
            if (Uppercases.includes(letter)) {
                console.log("letter = " + letter);
                var value = Uppercases.indexOf(letter) + 1;
                TF[state][x] = value.toString();
                console.log("TF = " + TF[state][x]);
            } else {
                TF[state][x] = "0";
            }
        }
    }

    var table = document.getElementById("transition_table");
    console.log(table);
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

document.getElementById("openFile").addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        lines = this.result.replace(/\n\s*\n/g, '.').split('.');
        var text = fr.result;
        document.getElementById('text').innerText = text;
    }
    fr.readAsText(this.files[0]);
});

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
    console.log(patterns);
    for (var i = 0; i < patterns.length; i++) {
        occurrences[patterns[i]] = 0;
    }

    result = new Array(lines.length);
    for (var line = 0; line < lines.length; line++) {
        result[line] = new Array(patterns.length);
        for (p = 0; p < patterns.length; p++) {
            result[line][p] = new Array(0);
        }
    }

    for (i = 0; i < states.length; i++) {
        for (j = 0; j < alphabets.length; j++) {
            // TF[i][keys[j].charCodeAt()] = document.getElementById("TF[" + i + "][" + keys[j].charCodeAt() + "]").value;
            var next_states = document.getElementById("TF[" + i + "][" + alphabets[j].charCodeAt() + "]").value;
            if (next_states.length > 0) {
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
        // var words = lines[line].split(" ");
        // if (words[0] === "") {
        //     words.shift();
        // }
        var chars = lines[line].split("");

        var current_state = initial;

        var transition = "0";
        var substrings = [];
        var haystack = lines[line];
        var status = "Rejected";
        console.log('----------------------------------');

        // var patterns = [];
        for (i = 0; i < chars.length; i++) {

            var next_state = search(current_state, chars[i]);
            console.log("Char=" + chars[i] + " , I =" + i);

            if (final.includes(next_state) && (next_state != current_state)) {
                var pattern = "";
                var reverse_state = next_state;
                for (var r = i; r >= 0; r--) {
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
                            if (q.toString() == "0") {
                                reverse_state = q.toString();
                                pattern = chars[r] + pattern;
                                break;
                            } else if (colIndex.toString() == chars[(r - 1)].charCodeAt()) {
                                reverse_state = q.toString();
                                pattern = chars[r] + pattern;
                                break;
                            }
                        }
                    }
                    console.log("reverse_STATE + CHAR =" + pattern + "   &    " + reverse_state);
                    if (reverse_state == "0") {
                        break;
                    }
                    // if (patterns.includes(pattern)) {
                    //     break;
                    // }
                }
                // pattern = pattern.split("").reverse().join("");
                // var reg = new RegExp(pattern, "g");
                // words[word] = words[word].replace(reg, pattern.bold());

                var index = i - pattern.length + 1;
                if (result[line][patterns.indexOf(pattern)].indexOf(index) === -1) {
                    result[line][patterns.indexOf(pattern)].push(index);
                }

                occurrences[pattern] = occurrences[pattern] + 1;

                if (substrings.indexOf(pattern) === -1) {
                    substrings.push(pattern);
                }
                status = "Accepted";

                transition += "-->" + next_state;
                current_state = next_state;
                // next_state = initial;
            } else {
                transition += "-->" + next_state;
                current_state = next_state;
            }
            console.log("Previous = " + current_state);
            console.log("Next = " + next_state);
        }

        demo_text += "<br><strong>Transition:</strong> " + transition;
        demo_text += "<br><strong>Needles:</strong> " + patterns.join(",");
        demo_text += "<br><strong>Haystack:</strong> " + haystack;
        demo_text += "<br><strong>Status:</strong> " + status + "<br>";
        if (substrings.length > 0) {
            demo_text += "<strong>Substring found:</strong> " + substrings.join(",") + "<br>";
        }

        for (p = 0; p < substrings.length; p++) {
            var reg = new RegExp(substrings[p], "g");
            lines[line] = lines[line].replace(reg, "<mark>" + substrings[p] + "</mark>");
        }
    }

    demo.innerHTML = demo_text;

    $("#label").show();

    var new_text = document.getElementById("haystack");

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

    var occurence_text = "<h5 style='color:blue;'><strong>Occurences</strong></h5>";
    for (var key in occurrences) {
        occurence_text += key + " : " + occurrences[key] + " founds<br>";
    }
    document.getElementById("occurence").innerHTML = occurence_text;

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