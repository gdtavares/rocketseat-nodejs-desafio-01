//  As per https://www.scaler.com/topics/read-csv-javascript/
import fs from "fs";
import { parse } from "csv-parse";

const csvPath = new URL("../sample.csv", import.meta.url);
async function readCsvData(row) {
  const csvData = fs
    .createReadStream(csvPath)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
      //  Trecho executado para cada row.
      //  Chamar a API de criar Task
      const title = row[0];
      const description = row[1];
      await fetch("http://localhost:3333/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
        duplex: "half",
      });
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      console.log("finished");
    });
  // console.log("file", file);
}
readCsvData();
