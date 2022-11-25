import { useEffect, useState } from "react";
import Papa from "papaparse";
const GENESIS = require("./Genesis.csv");
const EXODUS = require("./Exodus.csv")
// This file will be responsible for reading in and parsing
// a given CSV file (i.e. the Bible)
// args should be Book, Chapter, starting verse, ending verse
export async function readCsv(updateBibleArray) {
    var parsedData = [];
    var verseCounter = 0;

    var currentChapter = 0;
    var previousChapter = 0;
    var tempVerseArray = new Array();
    // WHAT TO DO:
    // make this function async and await parse promise
    // need to be able to use the useState function/await return of parse
    const papaPromise = Papa.parsePromise = function () {
        return new Promise(function (complete, error) {
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
                    // updateBibleArray(parsedData);
                    updateBibleArray(parsedData);
                },
            });
        });
    }
    
}

export function getChapters(book) {
    let chapters = 0;
    const bookToRead = require("./"+book+".csv");
    let tempVerseArray = [];
    Papa.parse(bookToRead, {
        download: true,
        delimiter: ",",
        escapeChar: "\\",
        header: true,
        step: function(row) {
            if(!tempVerseArray.includes(row.data.chapter))
                tempVerseArray.push(row.data.chapter);
            // setChapters(tempVerseArray.length);
        },
        complete: function() {
            chapters = tempVerseArray.length;
        },
        error: function(error) {
            console.log(error);
        }
    });

    console.log(chapters);
    return chapters;
}