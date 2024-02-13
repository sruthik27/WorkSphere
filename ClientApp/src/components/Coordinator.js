import React, { useEffect, useState } from 'react';
import TaskTable from './TaskTable';
import "./AdminMain.css";
import { useLocation, useNavigate } from "react-router-dom";
import routeMappings from "../routeMappings";
import EXCEL from './excel.png';

const Coordinator = () => {
  const [itemData, setItemData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state || !location.state.fromAdminHome) {
      navigate('/');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/db/getworks');
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
       ) : (
        <div>
          <button className="go-back-button topNav" onClick={() => navigate(routeMappings["Csjdjovn="],{ state: { fromAdminHome: true } })}>Home</button>
          <div className="topNav excel-download" onClick={downloadExcel}>
            <p className='excel-title '>Download in Excel:</p>
            <img className='excel-logo' src={EXCEL} />
          </div>
          <div className='tasktable-home'>
            <TaskTable data={itemData} editable={true}/>
          </div>
        </div>
      )}
    </>
  )
}

export default Coordinator;