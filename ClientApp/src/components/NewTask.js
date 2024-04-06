import React, {useState, useEffect} from "react";
import './NewTask.css';
import './AdminMain.css';
import Slider from '@mui/material/Slider';
import routeMappings from "../routeMappings";
import {useLocation, useNavigate} from 'react-router-dom';
import Delete from './trash_icon.png';
import DropUp from "./DropUp.png";
import DropDown from "./DropDown.png";

const NewTask = (props) => {
    const location = useLocation();
    const [workName, setWorkName] = useState("");
    const [workCost, setWorkCost] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [taskDescription, setTaskDescription] = useState("");
    const [workers, setWorkers] = useState([]);
    const [selectedWorkers, setSelectedWorkers] = useState([]);
    const [selectedWorkersNames, setSelectedWorkersNames] = useState([]);
    const [coordinator, setCoordinator] = useState("");
    const [subtaskDescription, setSubtaskDescription] = useState("");
    const [subtaskDueDate, setSubtaskDueDate] = useState(new Date());
    const [noOfSubtasks, setNoOfSubtasks] = useState(1);
    const [subtasks, setSubtasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWorkers,setShowWorkers] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dropDownIcon, setDropDownIcon] = useState(false);
    const navigate = useNavigate();


    const fetchWorkerNames = () => {
        setIsLoading(false);
        fetch('/db/getworkers')
            .then(response => response.json())
            .then(data => setWorkers(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        fetchWorkerNames();
        if (location.state && location.state.worker) {
            let parts = location.state.worker.split("?");
            setSelectedWorkers([parts[0]]);
        setSelectedWorkersNames([parts[1]]);

        }
    }, [location]);

    const formatDateToYYYYMMDD = (date)=> {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


    const validateForm = () => {
        if (workName === "") {
            setErrorMessage("Work Name is required");
            return false;
        }

        if (workCost === "" || isNaN(workCost) || parseInt(workCost, 10)<1) {
            setErrorMessage("Work Cost is required and must be a number");
            return false;
        }

        if (selectedWorkers.length===0) {
            setErrorMessage("Atleast one worker is required");
            return false;
        }

        if (startDate === "") {
            setErrorMessage("Start Date is required");
            return false;
        }

        if (dueDate === "") {
            setErrorMessage("Due Date is required");
            return false;
        }

        if (coordinator === "") {
            setErrorMessage("Coordinator is required");
            return false;
        }

        if (noOfSubtasks===1) {
            setErrorMessage("Add atleast one subtask");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const handleWorkerChange = (worker) => {
        let parts = worker.split("?");
        handleWorkerChange1(parts[0]);
        handleWorkerChange2(parts[1]);
    };

    const handleWorkerChange1 = (workerId) => {
        setSelectedWorkers(prevWorkers => {
            if (prevWorkers.includes(workerId)) {
                // If the worker is already selected, remove it from the array
                return prevWorkers.filter(id => id !== workerId);
            } else {
                // If the worker is not selected, add it to the array
                return [...prevWorkers, workerId];
            }
        });
    };

    const handleWorkerChange2 = (workerName) => {
        setSelectedWorkersNames(prevWorkers => {
            if (prevWorkers.includes(workerName)) {
                // If the worker is already selected, remove it from the array
                return prevWorkers.filter(name => name !== workerName);
            } else {
                // If the worker is not selected, add it to the array
                return [...prevWorkers, workerName];
            }
        });
    };

    const handleFormSubmit = async () => {
        // Calculate the total weightage of the subtasks
        const totalWeightage = subtasks.reduce((total, subtask) => total + subtask.weightage, 0);

        // If the total weightage is not 100, show an alert and return early
        if (totalWeightage !== 100) {
            alert("The total weightage of the subtasks does not add up to 100. Please check the subtask weightages.");
            return;
        }
        if (!validateForm()) {
    return;
  }
        startDate.setHours(startDate.getHours() + 5);
        startDate.setMinutes(startDate.getMinutes() + 30);
        dueDate.setHours(dueDate.getHours() + 5);
        dueDate.setMinutes(dueDate.getMinutes() + 30);
        const newWork = {
            work: {
                work_name: workName,
                work_description: taskDescription,
                work_status: 'A',
                start_date: startDate.toISOString(),
                due_date: dueDate.toISOString(),
                total_subtasks: subtasks.length,
                completed_subtasks: 0,
                wage: workCost,
                workers: selectedWorkers,
                advance_paid: false,
                bill_paid: false,
                coordinator: coordinator
            },
            subtasks: subtasks,
        };

        var jsonData = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newWork),
            redirect: 'follow'
        };

        await fetch("/db/addwork", jsonData)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        setWorkName("");
        setTaskDescription("");
        setWorkCost("");
        setSelectedWorkers([]);
        setDueDate(new Date());
        setStartDate(new Date());
        setCoordinator("");
        setIsLoading(true);

        navigate(routeMappings["bHWtcH10="], );
    };

    const handleSliderChange = (index) => (event, newValue) => {
        setSubtasks((prevSubtasks) => {
            const newSubtasks = [...prevSubtasks];
            newSubtasks[index].weightage = newValue;
            newSubtasks[index].isSet = true;

            let remainingWeightage = 100 - newSubtasks.filter(subtask => subtask.isSet).reduce((total, subtask) => total + subtask.weightage, 0);
            const unsetSubtasks = newSubtasks.filter((_, i) => i !== index && !newSubtasks[i].isSet);
            const totalUnsetWeightage = unsetSubtasks.reduce((total, subtask) => total + subtask.weightage, 0);

            // Distribute the remaining weightage among unset subtasks proportionally
            unsetSubtasks.forEach(subtask => {
                if (totalUnsetWeightage === 0) {
                    subtask.weightage = Math.floor(remainingWeightage / unsetSubtasks.length / 5) * 5;
                } else {
                    subtask.weightage = Math.floor((subtask.weightage / totalUnsetWeightage) * remainingWeightage / 5) * 5;
                }
                remainingWeightage -= subtask.weightage;
            });

            // If there's any remaining weightage left due to rounding down, add it to the first unset subtask
            if (remainingWeightage > 0 && unsetSubtasks.length > 0) {
                let i = 0;
                while (remainingWeightage > 0 && i < unsetSubtasks.length) {
                    unsetSubtasks[i].weightage += 5;
                    remainingWeightage -= 5;
                    i++;
                }
            }

            return newSubtasks;
        });
    };

    const handleDeleteSubtask = (index) => {
        setSubtasks(prevSubtasks => prevSubtasks.filter((_, i) => i !== index));
        setNoOfSubtasks(x => x - 1);
    };

    const handleSubtaskFormSubmit = () => {
        subtaskDueDate.setHours(dueDate.getHours() + 5);
        subtaskDueDate.setMinutes(dueDate.getMinutes() + 30);
        const newSubtask = {
            task_name: subtaskDescription,
            due_date: subtaskDueDate.toISOString(),
            completed: false,
            order_no: noOfSubtasks,
            weightage: 0,
            isSet: false
        };
        setSubtasks([...subtasks, newSubtask]);
        setNoOfSubtasks(x => x + 1);
        setSubtaskDescription("");
        setSubtaskDueDate(new Date());
        handleCloseModal();
    };

    const HandDropDownICon = () => {
        setShowWorkers(!showWorkers);
        dropDownIcon ? setDropDownIcon(false) : setDropDownIcon(true)
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const noOfChecked = Object.values(selectedWorkers.filter(Boolean));

    return (
        <>
            {isLoading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            ) : 
                <div className="form-background">
                    <button className="go-back-button" onClick={() => navigate(-1)}>Home</button>
                    <div className="form">
                        <div>
                            <div>
                                <h1 className="heading">PUBLISH NEW TASK</h1>
                                <hr className="heading-line"/>
                            </div>
                            <form className="form-class">
                                <div className="form-group">
                                    <label>Work Name: </label>
                                    <input
                                        type="text"
                                        className="formcontrol"
                                        placeholder="Type Work Name"
                                        value={workName}
                                        onChange={event => setWorkName(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Work Cost: </label>
                                    <input
                                        type="number"
                                        className="formcontrol"
                                        placeholder="Type Work Cost"
                                        value={workCost}
                                        onChange={event => setWorkCost(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Start Date: </label>
                                    <input
                                        type="date"
                                        value={formatDateToYYYYMMDD(startDate)}
                                        onChange={(event) => setStartDate(new Date(event.target.value))}
                                        className="formcontrol"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Due Date: </label>
                                    <input
                                        type="date"
                                        value={formatDateToYYYYMMDD(dueDate)}
                                        onChange={(event) => setDueDate(new Date(event.target.value))}
                                        className="formcontrol"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Task Description: </label>
                                    <input
                                        type="text"
                                        placeholder="Type task description"
                                        onChange={(event) => setTaskDescription(event.target.value)}
                                        className="formcontrol"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Agency: </label>
                                    <div className="dropdown-check-list">
                                        <div className="dropdown-button" onClick={HandDropDownICon}>
                                            <span >{selectedWorkersNames.length > 0 ? (selectedWorkersNames.map((worker, i) =>(
                                                i === 0 ? (worker.charAt(0).toUpperCase() + worker.slice(1)) :  (", " + worker.charAt(0).toUpperCase() + worker.slice(1)) 
                                            )) ) : "Select Agencies"}</span>
                                            <span >{ dropDownIcon ? <img src={DropUp}/> : <img src={DropDown}/> }</span>
                                        </div>
                                        {showWorkers && (
                                            <div className="items">
                                                {workers.map((worker, index) => (
                                                <fieldset className={selectedWorkers.includes(worker.worker_name) ? 'items-field-selected' : 'items-field'} key={index}>
                                                    <input
                                                        style={{cursor: 'pointer'}}
                                                        type="checkbox"
                                                        id={worker.worker_id}
                                                        value={worker.worker_id+"?"+worker.worker_name}
                                                        checked={selectedWorkers.includes(worker.worker_id)}
                                                        onChange={(event) => handleWorkerChange(event.target.value)}
                                                    />
                                                    <label htmlFor={worker.worker_id}>{worker.worker_name.charAt(0).toUpperCase() + worker.worker_name.slice(1)}</label>
                                                </fieldset>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Coordinator: </label>
                                    <input
                                        type="text"
                                        placeholder="Who is supervising?"
                                        onChange={(event) => setCoordinator(event.target.value)}
                                        className="formcontrol"
                                    />
                                </div>
                                <div className="task-button">
                                    <button type="button" className="add-button" onClick={handleShowModal}>
                                    Add Subtask
                                    </button>
                                </div>
                                <div>
                                    {subtasks.map((subtask, index) => (
                                        <div className="subtask-des" key={index}>
                                            <div className="subtask-head-div">
                                                <h1 className="subtask-des-head">Sub Task {index + 1}</h1>
                                                <img className="subtask-delete-btn" src={Delete}
                                                    onClick={() => handleDeleteSubtask(index)}/>
                                            </div>
                                            <p className="subtask-des-des">Description: {subtask.task_name}</p>
                                            <p className="subtask-des-des">Due
                                                Date: {new Date(subtask.due_date).toDateString()}</p>
                                            <div className="form-group">
                                                <label>Task Weightage: </label>
                                                <Slider
                                                    aria-label="Temperature"
                                                    defaultValue={1}
                                                    valueLabelDisplay="auto"
                                                    step={5}
                                                    marks
                                                    min={0}
                                                    max={100}
                                                    style={{color: "#640000"}}
                                                    onChange={handleSliderChange(index)}
                                                    value={subtask.weightage}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                        <div className="task-button">
                            <button type="button" className="add-button" onClick={handleFormSubmit}>
                                SUBMIT
                            </button>
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </div>
                    {showModal && (
                        <div tabIndex="-1" role="dialog" style={{display: showModal ? "block" : "none"}}>
                            <div role="document">
                                <div className="modalcontent">
                                    <div className="modal-inner">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add Subtask {noOfSubtasks}</h5>
                                            <hr className="heading-line"/>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="form-group">
                                                    <label>Description: </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter subtask description"
                                                        value={subtaskDescription}
                                                        onChange={(event) =>
                                                            setSubtaskDescription(event.target.value)
                                                        }
                                                        className="formcontrol"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Due Date: </label>
                                                    <input
                                                        type="date"
                                                        value={formatDateToYYYYMMDD(subtaskDueDate)}
                                                        onChange={(event) =>
                                                            setSubtaskDueDate(new Date(event.target.value))
                                                        }
                                                        className="formcontrol"
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modalfooter">
                                            <button type="button" className="add-button" onClick={handleSubtaskFormSubmit}>
                                                Save Subtask
                                            </button>
                                            <button type="button" className="add-button" onClick={handleCloseModal}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }

        </>
    );
}

export default NewTask;