import Papa from "papaparse";

// This file will be responsible for reading in and parsing
// a given CSV file (i.e. the Bible)
// args should be Book, Chapter, starting verse, ending verse
export async function readCsv(filePath) {
    let test = await fetch("http://localhost:3000/" + filePath);
    console.log(await test.text());
}