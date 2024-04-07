import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./screen css/WorkPage.css";

//components import
import NavBar from '../component/NabBar';




const WorkPage = () => {
    const [itemData, setItemData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
            fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/db/getworks'); //need to add "/getWorks" after backend is pushed
            const data = await response.json();
            setItemData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const downloadExcel = async() => {
        fetch('/db/getexcel')
                  .then(response => {
                      if (!response.ok) {
                          throw new Error('Network response was not ok');
                      }
                      return response.blob();
                  })
                  .then(blob => {
                      // Create a link element
                      const url = window.URL.createObjectURL(new Blob([blob]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'works.xlsx');
  
                      // Append the link to the body
                      document.body.appendChild(link);
  
                      // Trigger the download
                      link.click();
  
                      // Cleanup
                      link.parentNode.removeChild(link);
                  })
                  .catch(error => {
                      console.error('There was an error downloading the Excel file:', error);
                  });
    }

    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
             ): (
                <div>
                    <NavBar />
                    
                </div>
            )}
        </>
    );
}

export default WorkPage;

{/* <div>
    <button className="go-back-button topNav" onClick={() => navigate(routeMappings["Csjdjovn="],{ state: { fromAdminHome: true } })}>Home</button>
    <div className="topNav excel-download" onClick={downloadExcel}>
        <p className='excel-title '>Download in Excel:</p>
    </div>
    <div className="tasktable-home">
        <TaskTable data={itemData} editable={false}/>
    </div>
</div> */}