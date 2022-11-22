import { useEffect, useState } from "react";
import Papa from "papaparse";
import { propTypes } from "react-bootstrap/esm/Image";
const GENESIS = require("./Genesis.csv");
// This file will be responsible for reading in and parsing
// a given CSV file (i.e. the Bible)
// args should be Book, Chapter, starting verse, ending verse
export function readCsv(updateBibleArray) {

    // WHAT TO DO:
    // make this function async and await parse promise
    // need to be able to use the useState function/await return of parse
    var parsedData = [];
    var verseCounter = 0;

    var currentChapter = 0;
    var previousChapter = 0;
    var tempVerseArray = new Array();
    Papa.parse(GENESIS, {
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
            }
            verseCounter = results.data.verse - 1;

            // this maps the verse # in a chapter with its corresponding scripture text
            tempVerseArray[verseCounter] = results.data.scripture;
            // console.log("Chapter: " + currentChapter + ", verse: " + verseCounter + ", text: " + tempVerseArray[verseCounter]);
            // regardless keep setting the setBibleArray hook to the current parsedData array
            updateBibleArray(parsedData);
        },
    });

    return parsedData;
}