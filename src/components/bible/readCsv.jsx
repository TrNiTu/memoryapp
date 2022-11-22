import { useEffect, useState } from "react";
import Papa from "papaparse";
const GENESIS = require("./Genesis.csv");
var BIBLEARRAY = new Array();
// This file will be responsible for reading in and parsing
// a given CSV file (i.e. the Bible)
// args should be Book, Chapter, starting verse, ending verse
export function readCsv() {

    // WHAT TO DO:
    // make this function async and await parse promise
    // need to be able to use the useState function/await return of parse
    const [bibleArray, setBibleArray] = useState({});
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
            //find some way to restart this temporary verse array,
            // then push that to the parsedData array (following the format below)
            if (previousChapter < currentChapter) {
                parsedData.push(tempVerseArray);
                tempVerseArray = [];
            }
            verseCounter = results.data.verse - 1;

            if (verseCounter === 0) {
                tempVerseArray.push(results.data.scripture);
            } else {
                tempVerseArray[verseCounter] = (results.data.scripture);
                verseCounter++;
            }
        }
    });

    console.log(parsedData);

    // example array:
    // array[chapter][verse] = scripture
    // array[chapter] = array of verses IE Genesis[1] = 
    // ["In the beginning, God created the heavens and the earth.", ..., "And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day."]
}