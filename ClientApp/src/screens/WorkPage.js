import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./screen css/WorkPage.css";

//components import
import NavBar from '../component/NabBar';
import TimeLineChart from '../component/TimeLineChart';

//Data import
import { TimeLineChartData } from '../data/Data';

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

    const data = [
        ['term','name', 'start', 'end'],
        ['1','Work1', new Date(2023, 11, 2), new Date(2024, 1, 1)],
        ['2','Work2', new Date(2023, 11, 12), new Date(2023, 12, 3)],
        ['3','Work3', new Date(2023, 12, 15), new Date(2024, 1, 15)],
        ['4','Work4', new Date(2023, 12, 25), new Date(2024, 1, 5)],
        ['5','Work5', new Date(2024, 1, 4), new Date(2024, 1, 31)],
        ['6','Work6', new Date(2024, 2, 14), new Date(2024, 3, 12)],
        ['7','Work7', new Date(2024, 2, 28), new Date(2024, 3, 30)],
        ['8','Work8', new Date(2024, 3, 5), new Date(2024, 4, 3)],
        ['9','Work9', new Date(2024, 3, 20), new Date(2024, 4, 30)],
        ['10','Work10', new Date(2024, 4, 1), new Date(2024, 5, 12)],
    ];

    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
             ): (
                <div>
                    <NavBar />
                    <TimeLineChart 
                        Data={ TimeLineChartData }
                        backgroundColor={
                            [
                                'rgba(255, 26, 104, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(0, 0, 0, 0.7)'
                            ]
                        }
                        borderColor={
                            [
                                'rgba(255, 26, 104, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(0, 0, 0, 1)'
                            ]
                        }
                    />
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