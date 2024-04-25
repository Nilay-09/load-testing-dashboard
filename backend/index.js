const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { PDFDocument, StandardFonts } = require('pdf-lib');
const tmp = require('tmp');

app.use(express.json());

const connectToDatabase = require('./config/db');
const getSystemInfo = require('./config/systemInfo');

// connectToDatabase();

var variableUrl;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/system-info', getSystemInfo);

app.get('/result-info', async (req, res) => {
    try {
      await getResultInfo(req, res);
    } catch (error) {
      console.error('Error in /result-info:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.post('/submit', (req, res) => {
    const { flattenedArray, webUrl,visualArray } = req.body;
    runLoadRunnerTest({ flattenedArray, webUrl,visualArray })

});



const preparePaths = (flattenedArray,webUrl) => {
    
    const filePathToDelete = "C:\\LoadRunnerProject\\Scripts\\SC01_PowerBI_Dashboards_TC_V4\\p_DashboardURL.dat";
    // const filePathToDelete = "C:\\LoadRunnerProject\\Scripts\\SC01_PowerBI_Dashboards_TC_V4\\p_DashboardURL.dat";

    try {
        fs.unlinkSync(filePathToDelete);
        console.log(`Deleted file: ${filePathToDelete}`);
    } catch (error) {
        console.error(`Error deleting file: ${error}`);
    }

    // Create a new file "C:\LoadRunnerProject\Scripts\POC_TruClient_Protocol\p_DashboardURL.dat" with content "hello"
    const filePathToCreate = "C:\\LoadRunnerProject\\Scripts\\SC01_PowerBI_Dashboards_TC_V4\\p_DashboardURL.dat";
    variableUrl = webUrl;
const fileContent = `p_DashboardURL
${variableUrl}
`;




// Output the file content
console.log(fileContent);
    try {
        fs.writeFileSync(filePathToCreate, fileContent);
        console.log(`Created file: ${filePathToCreate} ${fileContent}`);
    } catch (error) {
        console.error(`Error creating file: ${error}`);
    }

    // const filterName="C:\LoadRunnerProject\Scripts\POC_TruClient_Protocol\p_FilterName.dat"
    // const filterValue1="C:\LoadRunnerProject\Scripts\POC_TruClient_Protocol\p_FilterValue1.dat"


};


const writePaths = (flattenedArray) => {
    const filterNamePath = "C:\\LoadRunnerProject\\Scripts\\SC01_PowerBI_Dashboards_TC_V4\\p_FilterName.dat";
    
    // Empty the file
    try {
        fs.writeFileSync(filterNamePath, ''); // Empty content
    } catch (error) {
        console.error(`Error emptying content of file: ${error}`);
        return;
    }

    // Write constant p_FilterName to the file
    try {
        fs.writeFileSync(filterNamePath, 'p_FilterName\n', { flag: 'a' }); // Append mode
    } catch (error) {
        console.error(`Error writing constant p_FilterName to file: ${error}`);
    }

    // Write keys of flattenedArray to the file
    flattenedArray.forEach(obj => {
        const key = Object.keys(obj)[0];
        try {
            fs.writeFileSync(filterNamePath, `${key}\n`, { flag: 'a' }); // Append mode
        } catch (error) {
            console.error(`Error writing key to file: ${error}`);
        }
    });
};

const writePathsValues = (flattenedArray) => {
    const filterValue1Path = "C:\\LoadRunnerProject\\Scripts\\SC01_PowerBI_Dashboards_TC_V4\\p_FilterValue.dat";
    
    // Empty the file
    try {
        fs.writeFileSync(filterValue1Path, ''); // Empty content
    } catch (error) {
        console.error(`Error emptying content of file: ${error}`);
        return;
    }

    // Write constant p_FilterValue1 to the file
    try {
        fs.writeFileSync(filterValue1Path, 'p_FilterValue\n', { flag: 'a' }); // Append mode
    } catch (error) {
        console.error(`Error writing constant p_FilterValue1 to file: ${error}`);
    }

    // Write values of flattenedArray to the file
    flattenedArray.forEach((obj, index) => {
         // Exclude the first value, as it's the constant p_FilterValue1
            const value = Object.values(obj)[0];
            try {
                fs.writeFileSync(filterValue1Path, `${value}\n`, { flag: 'a' }); // Append mode
            } catch (error) {
                console.error(`Error writing value to file: ${error}`);
            }
        
    });
};


const writeVisuals = (visualArray) => {
    console.log("Hello from writeVisuals function!");


    const filterNamePath = "C:\\LoadRunnerProject\\Scripts\\SC01_PowerBI_Dashboards_TC_V4\\p_VisualSection.dat";

    
    // Empty the file
    try {
        fs.writeFileSync(filterNamePath, ''); // Empty content
    } catch (error) {
        console.error(`Error emptying content of file: ${error}`);
        return;
    }
    
    // Write constant p_FilterName to the file
    try {
        fs.writeFileSync(filterNamePath, 'p_VisualSection\n', { flag: 'a' }); // Append mode
    } catch (error) {
        console.error(`Error writing constant p_FilterName to file: ${error}`);
    }
    
    if (!visualArray || !Array.isArray(visualArray)) {
        console.error("Visual array is either undefined or not an array.",visualArray);
        return;
    }
    
    visualArray.forEach((key) => {
        try {
            fs.writeFileSync(filterNamePath, `${key}\n`, { flag: 'a' }); // Append mode
        } catch (error) {
            console.error(`Error writing key to file: ${error}`);
        }
    });
    console.log("hi")

};

const runLoadRunnerTest = (requestBody) => {

    const { flattenedArray, webUrl,visualArray } = requestBody;

    console.log("visualArray")
    console.log(visualArray)
    preparePaths(flattenedArray,webUrl);

    writePaths(flattenedArray)
    writePathsValues(flattenedArray)
    writeVisuals(visualArray)

    const command = 'START C:\\\\"Program Files (x86)\\\\"\\\\\"Micro Focus\"\\\\LoadRunner\\\\bin\\\\Wlrun.exe -Run -TestPath C:\\\\LoadRunnerProject\\\\Scenario\\\\sen.lrs -ResultName C:\\\\LoadRunnerProject\\\\Result';

    // exec(command, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error: ${error}`);

    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);

    //     checkAndRunLoadRunner()

    // });


};

const checkAndRunLoadRunner = () => {
    setTimeout(runLoadRunnerAnalysis, 10);
};


const deleteSessionFolder = () => {
    const sessionFolderPath = 'C:\\LoadRunnerProject\\Result\\Session1';


    if (fs.existsSync(sessionFolderPath)) {
        fs.rmdirSync(sessionFolderPath, { recursive: true });
        console.log(`Deleted ${sessionFolderPath}`);
    } else {
        console.log(`${sessionFolderPath} does not exist.`);
    }
};

const runLoadRunnerAnalysis = () => {

    deleteSessionFolder();

    const command = 'START "" "C:\\Program Files (x86)\\Micro Focus\\LoadRunner\\bin\\AnalysisUI.exe" -RESULTPATH "C:\\LoadRunnerProject\\Result\\Result.lrr" -TEMPLATENAME "template"';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        console.log("Hello Backend");
    });
};


async function getResultInfo(req, res) {
    const filePath = 'C:\\LoadRunnerProject\\Result\\Session1\\Transactions.pdf';
  
    if (fs.existsSync(filePath)) {
      const existingPdfBytes = fs.readFileSync(filePath);
  
      // Load the existing PDF and select the first page
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
  
      // Set the font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
      // Check if '&autoAuth' is in the variableUrl
      const splitIndex = variableUrl.indexOf('&autoAuth');
      
      let firstPart = variableUrl;
      let secondPart = '';
  
      if (splitIndex !== -1) {
        // Split the URL at '&autoAuth'
        firstPart = variableUrl.slice(0, splitIndex);
        secondPart = variableUrl.slice(splitIndex);
      }
  
      // Draw the URL with a newline if it has a second part
      firstPage.drawText(`Report URL: ${firstPart}`, {
        x: 50,
        y: 350,
        size: 10,
        font: font,
      });
  
      if (secondPart) {
        // Draw the second part on the next line to avoid overflow
        firstPage.drawText(secondPart, {
          x: 160,
          y: 335, // Adjust y-coordinate for next line
          size: 10,
          font: font,
        });
      }
  
      // Save the modified PDF to a temporary file
      const tempFile = tmp.fileSync({ postfix: '.pdf' });
      const pdfBytes = await pdfDoc.save();
  
      fs.writeFileSync(tempFile.name, pdfBytes); // Write the modified PDF to the temporary file
  
      // Set response headers to prompt download
      res.setHeader('Content-Disposition', 'attachment; filename="ModifiedTransactions.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
  
      // Create a read stream from the temporary file and pipe it to the response
      const fileStream = fs.createReadStream(tempFile.name);
      fileStream.pipe(res);
  
      // Clean up the temporary file when the response is finished
      res.on('finish', () => {
        fs.unlinkSync(tempFile.name); // Delete the temporary file after sending
      });
  
    } else {
      // File not found
      res.status(404).send('File not found');
    }
  }

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
