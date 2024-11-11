import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {
  const [id, setId] = useState('');
  
  const handleDownload = async () => {
    try {
      const token = process.env.REACT_APP_API_TOKEN;
      //console.log(token)

      const response = await axios.get(
        `${process.env.REACT_APP_API}/store/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const serviceList = response.data.data.serviceList;

      if (!serviceList || !Array.isArray(serviceList)) {
        throw new Error("Service list is missing or not an array");
      }

      // Create a workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(serviceList);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Services");

      // Generate an Excel file as a Blob
      const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a URL for the Blob and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'services.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("File downloaded successfully");
    } catch (error) {
      console.error('Error downloading file:', error.message);
    }
  };

  return (
    <>
      <input
        onChange={(e) => setId(e.target.value)}
        type="text"
        placeholder="Enter the store uuid"
      />
      <button onClick={handleDownload}>Click to Download</button>
    </>
  );
}

export default App;
