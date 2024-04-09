import React, { useState, useRef, useEffect } from "react";
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './components css/TimeLineChart.css';

const TimeLineChart = ({ Data, backgroundColor, borderColor }) => {
    const chartContainer = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [config, setConfig] = useState(null);
    
    useEffect(() => {
        const data = {
            datasets: [{
                data: Data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                borderSkipped: false,
                borderRadius: 10,
                barPercentage: 0.7

            }]
          };

          //status plugin block
          const status = {
            id: 'status',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

                ctx.save();
                ctx.font = 'bolder 12px sans-serif';
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                data.datasets[0].data.forEach((datapoint, index) => {
                    ctx.fillText(datapoint.status, right + 50, y.getPixelForValue(index));
                });
                ctx.fillText('Status', right + 50, top - 15);

                ctx.restore();
            }
          }

          // todayLine plugin block
          const todayLine = {
            id: 'todayLine',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

                ctx.save();

                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
                ctx.setLineDash([3, 3]);
                ctx.moveTo(x.getPixelForValue(new Date()), top);
                ctx.lineTo(x.getPixelForValue(new Date()), bottom);
                ctx.stroke();
                ctx.restore();

                ctx.setLineDash([]);

                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
                ctx.fillStyle = 'rgba(102, 102, 102, 1)';
                ctx.moveTo(x.getPixelForValue(new Date()), top + 3);
                ctx.lineTo(x.getPixelForValue(new Date()) - 6, top - 6);
                ctx.lineTo(x.getPixelForValue(new Date()) + 6, top - 6);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ctx.restore();

                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = 'rgba(102, 102, 102, 1)';
                ctx.textAlign = 'center';
                ctx.fillText('Today', x.getPixelForValue(new Date()), bottom + 15);
                ctx.restore();
            }
          }
      
          // config 
          const config = {
                type: 'bar',
                data,
                options: {
                    layout: {
                        padding: {
                            right: 100,
                            bottom: 20
                        }
                    },
                    indexAxis: 'y',
                    scales: {
                        x: {
                            position: 'top',
                            type: 'time',
                            time: {
                                // unit: 'day'
                                displayFormats: {
                                    day: 'd'
                                }
                            },
                            min: '2024-04-01',
                            max: '2024-04-30'
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => { return '' },
                                title: (ctx) => {
                                    const startDate = new Date(ctx[0].raw.x[0]);
                                    const endDate = new Date(ctx[0].raw.x[1]);
                                    const formattedStartDate = startDate.toLocaleString([], {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                    const formattedEndDate = endDate.toLocaleString([], {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                    return [`Work Title: ${ctx[0].raw.y}` ,`Work Deadline: ${formattedStartDate} - ${formattedEndDate}`];
                                }
                            }
                        }
                    }
                },
                plugins: [todayLine, status]
          };
      
          // render init block
          const myChart = new Chart(chartContainer.current, config);
          setConfig(myChart);
          return () => {
            myChart.destroy(); // cleanup
          };
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);

        const selectedDate = new Date(event.target.value);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Month is zero-based in JavaScript Date object
        const lastDay = new Date(year, month, 0).getDate();

        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

        config.config.options.scales.x.min = startDate;
        config.config.options.scales.x.max = endDate;
        config.update();

    };

    return(
        <div className="chartCard">
            <div className="chartBox">
                <canvas ref={chartContainer} id="myChart"></canvas>
                <input
                    type="month"
                    id="monthPicker"
                    name="monthPicker"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                />
            </div>
        </div>
    );
};

export default TimeLineChart;