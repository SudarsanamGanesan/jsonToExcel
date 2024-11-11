import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {
  const [id, setId] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  
  const handleDownload = async () => {
    try {
      // import.meta.env.VITE_API_MAIN_SERVER_URL
      
    

      const response = await axios.get(
        `${apiUrl}/store/${id}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
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
    <h3>Enter store Id</h3>
      <input
        onChange={(e) => setId(e.target.value)}
        type="text"
        placeholder="eec59400-1fb4-4b2c-a19b-959f05570f8f"
      />
      <button onClick={handleDownload}>Click to Download</button>
    </>
  );
}

export default App;
