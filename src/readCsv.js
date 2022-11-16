import Papa from "papaparse";
import * as fs from "fs";

export function readCsv(filePath) {
    fs.readFile(filePath, "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        Papa.parse(data, {
            step: function (row) {
                console.log("Row: ", data);
            }
        });
    });
}
