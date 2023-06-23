import { useState } from "react";
import "./App.scss";
import Invoice from "./Components/Invoice";
import * as XLSX from "xlsx";
function App() {
  const [data, setData] = useState(false);

  function upload(e) {
    var files = e.target.files;
    if (files.length == 0) {
      alert("Please choose any file...");
      return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == ".XLS" || extension == ".XLSX") {
      excelFileToJSON(files[0]);
    } else {
      alert("Please select a valid excel file.");
    }
  }

  //Method to read excel file and convert it into JSON
  function excelFileToJSON(file) {
    try {
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
          );
          if (roa.length > 0) {
            result[sheetName] = roa;
            setData(result);
            console.log("result ", result);
          }
        });
      };
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="App">
      {data ? (
        <Invoice data={data}/>
      ) : (
        <div>
          <h1>Upload an excel file to convert into JSON</h1>
          <input type="file" onChange={(e) => upload(e)} />
        </div>
      )}
    </div>
  );
}

export default App;
