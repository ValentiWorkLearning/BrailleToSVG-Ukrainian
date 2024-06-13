//*Constants
const scale = 4;
const dotSpacing = 2.5 * scale;
const letterSpacing = 7 * scale;
const dotSize = 0.8 * scale;
const lineSpacing = 11 * scale;

const brailleToShape = {
    "⠁": "1", "⠃": "12", "⠺": "2456", "⠛": "1245", "⠙": "145",
    "⠑": "15", "⠜": "345", "⠚": "245", "⠵": "1356", "⠊": "24",
    "⠽": "13456", "⠹": "1456", "⠯": "12346", "⠨": "46", "⠇": "123",
    "⠍": "134", "⠝": "1345", "⠕": "135", "⠏": "1234", "⠗": "1235",
    "⠎": "234", "⠞": "2345", "⠥": "136", "⠋": "124", "⠓": "125",
    "⠉": "14", "⠟": "12345", "⠱": "156", "⠭": "1346", "⠾": "23456",
    "⠳": "1256", "⠫": "1246", "⠼": "3456", "⠁": "1", "⠃": "12",
    "⠉": "14", "⠙": "145", "⠑": "15", "⠋": "124", "⠛": "1245",
    "⠓": "125", "⠊": "24", "⠚": "245", "⠂": "2", "⠒": "25",
    "⠲": "256", "⠢": "26", "⠖": "235", "⠶": "2 356", "⠸⠌": "456 34",
    "⠸⠡": "456 16", "⠤": "36", "⠠⠤": "6 36", "⠐⠠⠤": "5 6 36",
    "⠄": "3", "⠄⠶": "32 356", "⠘⠦": "45 236", "⠘⠴": "45 356",
    "⠄⠦": "3 236", "⠄⠴": "3 356", "⠆": "23"
};

const textToBraille = {
    "а": "⠁", "б": "⠃", "в": "⠺", "г": "⠛", "д": "⠙",
    "е": "⠑", "є": "⠜", "ж": "⠚", "з": "⠵", "и": "⠊",
    "і": "⠽", "ї": "⠹", "й": "⠯", "к": "⠨", "л": "⠇",
    "м": "⠍", "н": "⠝", "о": "⠕", "п": "⠏", "р": "⠗",
    "с": "⠎", "т": "⠞", "у": "⠥", "ф": "⠋", "х": "⠓",
    "ц": "⠉", "ч": "⠟", "ш": "⠱", "щ": "⠭", "ь": "⠾",
    "ю": "⠳", "я": "⠫", "number indicator": "⠼", "1": "⠁", "2": "⠃",
    "3": "⠉", "4": "⠙", "5": "⠑", "6": "⠋", "7": "⠛",
    "8": "⠓", "9": "⠊", "0": "⠚", ",": "⠂", ":": "⠒",
    ".": "⠲", "?": "⠢", "!": "⠖", "(": "⠶", ")": "⠶",
    "/": "⠸⠌", "\\": "⠸⠡", "-": "⠤", "– (en dash)": "⠠⠤", "— (em dash)": "⠐⠠⠤",
    "‘": "⠄", "“": "⠄⠶", "“": "⠘⠦", "”": "⠘⠴", "‘": "⠄⠦",
    "’": "⠄⠴", "\"": "⠆"
};
//*Variables
let btn = document.getElementById("btnConvert");
let iptText = document.getElementById("iptTekst");
let iptBraille = document.getElementById("iptBraille");
let svg = document.getElementById("svgBraille");

//* Add event listeners
iptText.onchange = generateBrailleTekst;
iptText.onkeyup = generateBrailleTekst;
iptText.onclick = generateBrailleTekst;
iptText.onpaste = generateBrailleTekst;

iptBraille.onchange = generateSvg;
iptBraille.onkeyup = generateSvg;
iptBraille.onclick = generateSvg;
iptBraille.onpaste = generateSvg;

//* Add code
generateBrailleTekst();

function generateBrailleTekst() {
    //Clean input 
    let invoer = iptText.value.toLowerCase();
    let res = "";
    for (let c of invoer) {
        if (textToBraille.hasOwnProperty(c))
            res += c;
    }
    //console.log(res);
    //Translate
    invoer = res;
    res = "";
    for (let c of invoer)
        res += textToBraille[c];
    iptBraille.value = res;
    //! Not a great idea
    generateSvg();
}



function generateSvg() {
    //Clean input
    invoer = iptBraille.value;
    res = "";
    for (let c of invoer)
        if (brailleToShape.hasOwnProperty(c))
            res += c;

    invoer = res;
    //? At this point the invoer only contains either ' ', '\n' or a braille unicode char
    //console.log(invoer);
    svg.innerHTML = "";

    let xStart = 25;
    let yStart = 20;
    let x = xStart;
    let y = yStart;

    for (let c of invoer) {
        //console.log(`${c} => ${textToShape[c]}`);
        if (c === "\n") {
            y += lineSpacing;
            x = xStart;
        }
        else if (c === " ")
            x += letterSpacing;
        else {
            let shape = brailleToShape[c];
            //Draw braille character
            for (let dot of shape) {

                dot = parseInt(dot);
                let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("fill", "#6666FF");
                let cx = dot > 3 ? dotSpacing : 0;
                let cy = ((dot - 1) % 3) * dotSpacing;
                circle.setAttribute("cx", x + cx);
                circle.setAttribute("cy", y + cy);
                circle.setAttribute("r", dotSize);
                svg.appendChild(circle);
            }
            x += letterSpacing;
        }
    }
}

//Download button
document.getElementById("btnDownload").onclick = () => {
    const blob = new Blob([svg.outerHTML.toString()]);
    const element = document.createElement("a");
    element.download = "braille.svg";
    element.href = window.URL.createObjectURL(blob);
    element.click();
    element.remove();
}