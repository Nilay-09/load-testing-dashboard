import "./App.css";
import { useState, useEffect } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";


import { toast,Toaster } from 'react-hot-toast';

import { RxCross2 } from "react-icons/rx";

import OC from "./OC.png";
import Microsoft from './Microsoft.png';
import temp from "./assets/Template.xlsx";


function App() {
  const [webUrl, setWebUrl] = useState(
    "https://app.powerbi.com/reportEmbed?reportId=08e9d049-6847-41b3-a94e-e3e4d5a4f04d&appId=5a6280f5-9149-4915-a230-040ec8cc0277"
  );
  const [sendingWebUrl, setSendingWebUrl] = useState(
    "https://app.powerbi.com/reportEmbed?reportId=08e9d049-6847-41b3-a94e-e3e4d5a4f04d&appId=5a6280f5-9149-4915-a230-040ec8cc0277"
  );

  const [reportId, setReportId] = useState("");
  const [clickedVisuals, setClickedVisuals] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const [viewPdf, setViewPdf] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);

  // const [ pageNumber, setPageNumber ] = useState< number >(1);





  const handleVisualClicked = (visual) => {
    console.log("visual");
    console.log(visual);

    
    let idx=visual?.detail?.dataPoints.length;

    let VisualName;
    let VisualID;
        if (visual?.detail?.visual?.type === "slicer") {
          VisualName = visual?.detail?.dataPoints[idx-1]?.identity[0]?.target?.column;
          VisualID = visual?.detail?.dataPoints[idx-1]?.identity[0]?.equals;
    }else{
      VisualName = visual.detail.visual.title
      VisualID = visual.detail.visual.name
    }



    let a = false;

    if (visual?.detail?.visual?.type === "slicer") {
        a = true;
    }

    if (!VisualName || !VisualID) {
      return;
  }
    
    const existingEntryIndex = clickedVisuals.findIndex(item => item.VisualName === VisualName);

    if (existingEntryIndex !== -1) {
       
        const updatedVisuals = [...clickedVisuals];
        updatedVisuals[existingEntryIndex].VisualID += `,${VisualID}`;
        setClickedVisuals(updatedVisuals);
    } else {
        
        const clickedVisual = {
            VisualName,
            VisualID,
            f: a
        };
        setClickedVisuals(prevState => [...prevState, clickedVisual]);
    }


};



  console.log("dataPro")
  console.log(clickedVisuals)

  const handleSearch = () => {
    let searchTerm = document.getElementById("searchterm").value;
    setSendingWebUrl(searchTerm);
    const newReportId = searchTerm.split("reportId=")[1].split("&")[0];
    searchTerm = searchTerm.split("&autoAuth=")[0];
    setReportId(newReportId);
    setWebUrl(searchTerm);
    setClickedVisuals([]);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // xl
 
  const notify = () => toast('Here is your toast.');
  const handleFileUpload = (e) => {


    // const reader = new FileReader();
    // reader.readAsBinaryString(e.target.files[0]);
    // reader.onload = (e) => {
    //   const data = e.target.result;
    //   const workbook = XLSX.read(data, { type: "binary" });
    //   const sheetName = workbook.SheetNames[0];
    //   const sheet = workbook.Sheets[sheetName];
    //   const parsedData = XLSX.utils.sheet_to_json(sheet);
    //   setData(parsedData);

    //   reRen(parsedData);
    // };
  };



  const handleDeleteEntry = (index) => {
    setClickedVisuals((prevState) => prevState.filter((_, i) => i !== index));
  };


  
  const handleSubmit = async () => {
    // Get the totalUser value
    const totalUser = document.getElementById("totalUser").value;



    let finalValuesToProceed = [];
    let finalVisualsToProceed = [];

    // Iterate over clickedVisuals array
    clickedVisuals.forEach((visual) => {
        // Check if visual.f is true
        if (visual.f) {
            // If true, add to finalValuesToProceed array
            finalValuesToProceed.push({
                [visual.VisualName]: visual.VisualID
            });
        } else {
            // If false, add to finalVisualsToProceed array
            finalVisualsToProceed.push(visual.VisualName);
        }
    });

    if (finalVisualsToProceed.length === 0) {
      finalVisualsToProceed.push("NoParam");
  }
    // Log the final values
    console.log("FinalValuesToProceed", finalValuesToProceed);
    console.log("FinalVisualsToProceed", finalVisualsToProceed);


    try {
      const requestBody = {
        flattenedArray: finalValuesToProceed,
        visualArray:finalVisualsToProceed,
        webUrl: sendingWebUrl,
      };
      const response = await fetch("http://localhost:4000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // If the response is successful, show a success toast
        toast.success("Results Generated successfully!");
        console.log(response);
    } else {
        // If the response is not successful, show a failure toast
        toast.error("Failed to submit request");
    }
      console.log("response");
      console.log(response);

      // Process the response here if needed
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAndSetPdfFile = async () => {
    try {
      const response = await fetch("http://localhost:4000/result-info");
      const blob = await response.blob();

      // Create URL for the Blob object
      let pdfUrl = await URL.createObjectURL(blob);

      setPdfFile(pdfUrl);
      setViewPdf(pdfUrl);
    } catch (error) {
      console.error("Error:", error);
      setPdfFile(null);
      setViewPdf(null);
    }
  };

  const handleClick = () => {
    fetchAndSetPdfFile();
  };


  // Token
  let anAccessToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOTlmYTE5OWQtMjY1My00ZTE2LWJkNjUtMTdjYzI0NGI0MjVlLyIsImlhdCI6MTcxMzk0OTA2MywibmJmIjoxNzEzOTQ5MDYzLCJleHAiOjE3MTM5NTM4MDQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84V0FBQUFQNzUvYUpONnJiT3B4dWRVQ2htNjVKWWFJQVZHNVFzd3hGZlNXOUVNelJsUGkzNE11WURCRUdoUE5ZdUN5VFU0IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMCIsImdpdmVuX25hbWUiOiJuaWxheSIsImlwYWRkciI6IjEwMy4xOTkuMjI0LjIwMCIsIm5hbWUiOiJuaWxheSIsIm9pZCI6ImQyZjE4ZmM0LTM4YzMtNDVjMC05NmQzLWFjYmQ1MzhkMTE2ZiIsInB1aWQiOiIxMDAzMjAwMzcwMEE2ODlCIiwicmgiOiIwLkFWVUFuUm42bVZNbUZrNjlaUmZNSkV0Q1hna0FBQUFBQUFBQXdBQUFBQUFBQUFDSUFMQS4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJLemg1UTI3c3FFTi1ya1NXb09OVFFtaGd2cGl1NnhXaGFNalQ4OENaOFFzIiwidGlkIjoiOTlmYTE5OWQtMjY1My00ZTE2LWJkNjUtMTdjYzI0NGI0MjVlIiwidW5pcXVlX25hbWUiOiJOaWxheUBpbm5vdmF0aW9uYWxvZmZpY2Vzb2x1dGlvbi5jb20iLCJ1cG4iOiJOaWxheUBpbm5vdmF0aW9uYWxvZmZpY2Vzb2x1dGlvbi5jb20iLCJ1dGkiOiJ3ZkdsR01oRWgwLUdlSTdEVlJpa0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.Uj7tUpNNitjLpqkKWrFyReyN0wThI8HToHmCLdMwhn8lf_6MfgCp7UwrY3H74DhYHRMgzYJdWwNCl1tlfV4cv6kxH8j9YrkYjhlzzsqQ6uBkx8gv8SROFkrNDo-vMqwNoNKE4O9vQN3x9zBujf2nyNbNO7-5XuVSzRnl-IhXzql-tfaJpUUU9OUa5M8s6lh3varNygoQZFkLt6XzBYEUaoDgxSjdTCYtFOS8VeOtJe231CUX7UQrZ5czheegzTptOOF4UfupkfctIwYfPZnl56oS3YYjS5PsSvZHEd2YZPb_dHVfj4OupfNfRB51Fb6WYR1VNYw6a-bwpiiXWqDBUg";

  const [ram, setRam] = useState(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/system-info");
        const data = await response.json();
        setRam(data);
      } catch (error) {
        console.error("Error fetching system info:", error);
      }
    };

    fetchSystemInfo();
  }, []);

  return (
    <>
      <div className="App">
        <div className="w-screen h-auto flex">
          {/* SideBar */}
          <div className=" w-[6.5rem] h-auto ">
            <div className="w-20 h-20 flex justify-center items-center">
              <img src={OC} alt="" className=" object-contain w-16" />
            </div>
          </div>

          {/* MainPage */}
          <div className="w-[85%]">
            <div
              className="flex justify-between items-center my-6 mx-3 gap-3"
              id="searchform"
            >
              <div className="relative w-[60%] flex">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3a5 5 0 017.07 7.07l4.24 4.24-1.42 1.42-4.24-4.24A5 5 0 018 13a5 5 0 110-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="searchterm"
                  placeholder="Search Powerbi URL"
                  className="pl-10 flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                  type="button"
                  id="search"
                  className="bg-[#05c0d9] hover:bg-[#00acc1] text-white font-semibold py-2 px-6 rounded-r-md transition duration-300 ease-in-out"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              <div className="flex gap-2">
                <div
                  id="cardHover"
                  className="max-w-[250px] rounded overflow-hidden shadow-sm mx-3"
                >
                  <div className="flex">
                    <div className="flex flex-col justify-center px-2">
                      <div id="userNameCard" className="text-sm font-semibold">
                        System RAM
                      </div>
                      <div className="text-xs text-gray-600">{ram?.ram}</div>
                    </div>
                  </div>
                </div>

                <div
                  id="cardHover"
                  className="max-w-[200px] rounded overflow-hidden shadow-sm mx-3"
                >
                  <div className="flex">
                    {/* <GiProcessor className='w-12 h-12 object-cover' /> */}
                    <div className="flex flex-col justify-center px-2">
                      <div id="userNameCard" className="text-sm font-semibold">
                        Processor
                      </div>
                      <div className="text-xs text-gray-600">
                        {ram?.processor}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  justify-between items-center mx-3 ">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="startSelecting"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="startSelecting"
                  className="text-gray-700 font-bold"
                >
                  Start Selecting Items to Test Load
                </label>
              </div>
            </div>

            <hr className="border border-solid border-[#00000018] border-b-1 my-3 " />

            <div className="flex justify-start items-center w-[100%]">
              <div className="w-[100%] mx-3 flex justify-start my-6 gap-10">
                <PowerBIEmbed
                  embedConfig={{
                    type: "report",
                    id: reportId,
                    embedUrl: webUrl,
                    accessToken: anAccessToken,
                    tokenType: models.TokenType.Aad,
                    settings: {
                      panes: {
                        filters: {
                          expanded: false,
                          visible: true,
                        },
                      },
                    },
                  }}
                  eventHandlers={
                    new Map([
                      [
                        "loaded",
                        function () {
                          console.log("Report loaded", window.report);
                        },
                      ],
                      [
                        "rendered",
                        function (event) {
                          console.log("Report rendered", event);
                        },
                      ],
                      [
                        "error",
                        function (event) {
                          console.log(event.detail);
                        },
                      ],
                      ["visualClicked", handleVisualClicked],
                      ["pageChanged", (event) => console.log(event)],
                      ["dataSelected", handleVisualClicked],
                      [
                        "info",
                        function (event) {
                          console.log("Info", event);
                        },
                      ],
                    ])
                  }
                  cssClassName={"reportClass"}
                  getEmbeddedComponent={(embeddedReport) => {
                    window.report = embeddedReport;
                  }}
                />

                {isChecked && (
                  <div className="listHolder w-[50%]">
                    {/* Content of the div */}
                    <h2 className="text-lg font-semibold mb-4">
                      Visuals Selected for Load Testing
                    </h2>

                    <ul className="p-4 rounded shadow">
                      {clickedVisuals.map((visual, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between mb-4 p-3 rounded-lg bg-white shadow-md hover:shadow-lg"
                        >
                          <div className="flex flex-col">
                            <div className="font-medium text-sm">
                              {visual.VisualName}
                            </div>
                            <div className="text-gray-600 text-xs">
                              {visual.VisualID}
                            </div>
                          </div>
                          <span
                            className="delete-icon text-gray-500 cursor-pointer"
                            onClick={() => handleDeleteEntry(index)}
                          >
                            <RxCross2 />
                          </span>
                        </li>
                      ))}
                    </ul>

                    {clickedVisuals.length > 0 && (
                      <div className="mt-4 flex justify-between">
                        <input
                          type="number"
                          placeholder="Total Users"
                          className="mt-1 px-6 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                          id="totalUser"
                          min={1}
                        />

                        <button
                          onClick={handleSubmit}
                          className="mt-2 px-4 py-2 bg-[#05c0d9] hover:bg-[#00acc1] text-white rounded focus:outline-none  text-sm"
                        >
                          Submit
                        </button>
                        
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <hr className="border border-solid border-[#0000002d] border-b-1 mb-10" />

            <div className="w-full flex items-center mb-[20px]">
              <p className="text-lg font-semibold mb-2">
                Results from Load Test
              </p>
              <button
                className="btn-wrap vn-green flex h-10 justify-center items-center"
                onClick={handleClick}
              >
                Generate PDF
              </button>

              <a href="http://localhost:4000/result-info">Download</a>
            </div>

            <div className="w-[100%] h-[35rem] flex justify-center items-center overflow-y-auto  mb-[200px]">
              {viewPdf && (
                <div className="w-full h-screen flex justify-center items-center">
                  <iframe
                    src={viewPdf}
                    title="PDF Viewer"
                    className="w-[80%] h-[80%] border-none"
                    style={{ minHeight: "500px" }}
                  ></iframe>
                </div>
              )}

              {!viewPdf && ""}
            </div>
          </div>

          <div className=" w-[6.5rem] h-auto pt-8 ">
            <div className="w-22 h-22 flex justify-center items-center">
              <img
                src={Microsoft}
                alt=""
                className=" object-contain w-24 mr-4"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
