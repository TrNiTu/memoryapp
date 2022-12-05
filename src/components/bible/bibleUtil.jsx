import Papa from "papaparse";
// This file will be responsible for reading in and parsing
// a given CSV file (i.e. the Bible)
// args should be Book, Chapter, starting verse, ending verse
export function readCsv(updateBibleArray, book) {
    const bookToRead = require("./csv/" + book + ".csv");

    var parsedData = [];
    var verseCounter = 0;
    var currentChapter = 0;
    var previousChapter = 0;
    var tempVerseArray = new Array();
    Papa.parse(bookToRead, {
        download: true,
        delimiter: ",",
        escapeChar: "\\",
        header: true,
        step: function (results) {
            previousChapter = currentChapter;
            currentChapter = results.data.chapter - 1;

            // if the chapter changes, add it to the "chapters" array
            // then clear the temporary array
            if (previousChapter < currentChapter) {
                parsedData.push(tempVerseArray);
                tempVerseArray = [];
                updateBibleArray(parsedData);
            }
            verseCounter = results.data.verse - 1;

            // this maps the verse # in a chapter with its corresponding scripture text
            tempVerseArray[verseCounter] = results.data.scripture;
        },
    });
}