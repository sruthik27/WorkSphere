import React, {Component} from 'react';
import PopUp from "./PopUp";
import ProgressChart from './ProgressChart';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import CommentBox from './CommentBox';
import CommentCard from './CommentCard';
import Switch from '@mui/material/Switch';
import {Puff} from 'react-loader-spinner';
import Template from './BasePdf';

import { text, image, barcodes } from "@pdfme/schemas";
import { generate } from "@pdfme/generator";

class PuffLoader extends React.Component {
    render() {
        return (
            <Puff
            height="80"
            width="80"
            radius={1}
            color="#640000"
            ariaLabel="puff-loading"
            visible={true}
            />
        );
    }
}

class TaskTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTask: [],
            completeTask: [],
            selectedItem: null,
            selectedSubtasks: [],
            selectedComments: [],
            selectedDate: new Date(),
            orderChanged: false,
            editable: this.props.editable,
            dueDateDiff: 0,
            advancePaid: 0,
            dateOfPaid: "-",
            enteredAdvance: "",
            enteredDate: new Date(),
            isChecked: false,
            nowPaid: false,
            paidbills: new Map(),
            isLoading: false,
        };
    }

    componentDidMount() {
        // Check if itemData is available before processing
        if (this.props.data.length > 0) {
            this.processData(this.props.data);
        }
    }

    // Add componentDidUpdate to handle updates to props.data
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.processData(this.props.data);
        }
        if (prevState.selectedDate !== this.state.selectedDate) {
            this.processData(this.props.data);
        }
    }

    handleItemClick = async (item) => {
    // Set the selected item details when a p tag is clicked
    this.setState({ selectedItem: true,isLoading: true}, async () => {

        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();

        let fetchedpayments = await fetch(`/db/getpayments?workid=${item.work_id}`);
        let payments = await fetchedpayments.json();
        let adv = payments.find(x => x.payment_type === 'A');
        if (adv !== undefined) {
            let adv_amt = adv.paid_amount;
            let adv_date = adv.paid_date;
            this.setState({ advancePaid: adv_amt, dateOfPaid: adv_date });
        } else {
            this.setState({ advancePaid: 0, dateOfPaid: '-' });
        }

        let fetchedcomments = await fetch(`/db/getreviews?workid=${item.work_id}`);
        let comments = await fetchedcomments.json();
        if (comments.length > 0) {
            this.setState({ selectedComments: comments });
        }

        let currentDate = new Date();
        let parts = item.due_date.slice(0,10).split('-');
        let dueDate = new Date(parts[0], parts[1]-1, parts[2]);
        currentDate.setHours(0,0,0);
        let diffInTime = dueDate.getTime() - currentDate.getTime();
        let diffInDays = Math.round(diffInTime / (24 * 60 * 60 * 1000));

        // Use the callback function of setState to ensure the state is updated
        this.setState({ selectedItem: item, selectedSubtasks: tasks, dueDateDiff: diffInDays }, () => {
            this.setState({ isLoading: false });
        });
    });
}

    handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(this.state.selectedSubtasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        this.setState({selectedSubtasks: items, orderChanged: true});
    };

     handleClose = () => {
        this.setState({selectedItem: null});
        this.setState({selectedComments: []});
        if (this.state.orderChanged) {
            this.state.selectedSubtasks.map((v, i) => {
                const url = `/db/updateorder?task_id=${v.task_id}&new_order=${i + 1}`;

                fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Success:", data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            });
            this.setState({orderChanged: false});
        }
        if (this.state.paidbills.has(this.state.selectedItem.work_id)) {
            var requestOptions = {
                method: 'PUT',
                redirect: 'follow'
            };

            fetch(`/db/updatebill?workid=${this.state.selectedItem.work_id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
        window.location.reload();
    }

    processData(data) {
        let activeTask = [];
        let completeTask = [];

        // Filter the data based on the selectedDate and start_date
        data = data.filter(x => new Date(x.start_date) <= this.state.selectedDate);

        data.forEach(x => {
            if (x.work_status === 'A') activeTask.push(x);
            else if (x.work_status === 'C') completeTask.push(x);
        });

        this.setState({
            activeTask,
            completeTask,
        });
    }

    handleToggle = () => {
        this.setState(prevState => ({
            isChecked: !prevState.isChecked
        }));
    };


    handleSubmit = () => {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_type: 'A',
                paid_amount: this.state.enteredAdvance,
                paid_date: this.state.enteredDate.toISOString(),
                work: this.state.selectedItem.work_id,
            }),
            redirect: 'follow'
        };

        fetch("/db/addpayment", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({isChecked: false});
            })
            .catch(error => console.log('error', error));
        this.setState({advancePaid: this.state.enteredAdvance, dateOfPaid: this.state.enteredDate.toISOString()});
    }

    handleBill = () => {
        if (this.state.paidbills.has(this.state.selectedItem.work_id)) {
            this.state.paidbills.delete(this.state.selectedItem.work_id);
        } else {
            this.state.paidbills.set(this.state.selectedItem.work_id, true);
        }
    }

    generatePDF = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;

        (async () => {
  const template = Template;

      const plugins = { text, image, qrcode: barcodes.qrcode };
      const inputs = [
      {
        "field1": this.state.selectedItem.work_name,
        "field2": "Rs." + this.state.selectedItem.wage.toString(),
        "field3": (this.state.advancePaid === 0 ? "No" : "Rs." + this.state.advancePaid),
        "field4": (this.state.dateOfPaid === '-' ? "-" : this.state.dateOfPaid.slice(0, 10)),
        "field5": (this.state.selectedItem.bill_paid ? "Yes" : "No"),
        "field6": this.state.selectedItem.start_date.slice(0, 10),
        "field7": this.state.selectedItem.due_date.slice(0, 10),
        "field8": (this.state.selectedItem.work_status === 'A' ? "Active Task" : "Completed Task"),
        "field9": this.state.selectedItem.coordinator,
        "field10": this.state.selectedItem.worker_names,
        "field11": this.state.selectedSubtasks.length.toString(),
        "field12": this.state.selectedItem.work_description,
        "field13": 'Downloaded on ' + formattedDate
      }
    ];

     const pdf = await generate({ template, plugins, inputs });

    // Set the PDF name as work_name
    const fileName = this.state.selectedItem.work_name + '.pdf';

    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });

    // Create a link element and trigger a click to download the PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    })();
    };

    HandleUndo = async (subtask) => {
        var requestOptions = {
            method: 'PUT',
            redirect: 'follow'
        };

        await fetch(`/db/undotaskcomplete?task_id=${subtask.task_id}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        this.handleClose();
    }

    render() {
        const {
            activeTask,
            completeTask,
            selectedItem,
            selectedSubtasks,
            dueDateDiff, advancePaid, dateOfPaid, editable, isChecked, paidbills,isLoading
        } = this.state;

        return (
            <>
                <div className="datepickerwrapper">
                    <p className='datepickerhead'> Filter by date: <input
                        type="date"
                        className="custom-datepicker"
                        value={this.state.selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => this.setState({selectedDate: new Date(e.target.value)})}
                    />
                    </p>
                </div>
                <div className="task-table">
                    <div className='table-left'>
                        <p className='table-head1'>Active Task</p>
                        <div className='scroll1'>
                            <ul>
                                {activeTask.map((x, i) => (
                                    <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                        {x.work_name}
                                    </p>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='table-right'>
                        <p className='table-head'>Completed Task</p>
                        <div className='scroll'>
                            <ul>
                                {completeTask.map((x, i) => (
                                    <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                        {x.work_name}
                                    </p>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <PopUp trigger={selectedItem !== null}>
                    {/* Pass the selectedItem as a prop to the PopUp */}
                    {isLoading ?
                        <div className="overlay">
                            <div className="puff-loader"><PuffLoader /></div>
                        </div>: (
                    selectedItem && (
                        <div id='elementId'>
                            <h1 className="close-btn" onClick={this.handleClose}>x</h1>
                            {/* Display information related to the selectedItem here */}
                            <h2 className='popup-head'>Work Details:</h2>
                            <hr className='line'/>
                            <div className='popup-info'>
                                <div className='detail-grid-1'>
                                <div className="detail">
                                        <span className="label">Work Name</span>:<span className='label-inner'>{selectedItem.work_name}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Start Date</span>:<span className='label-inner'>{selectedItem.start_date.slice(0, 10)}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Coordinator</span>:<span className='label-inner'>{selectedItem.coordinator}</span>
                                    </div>
                                    {dueDateDiff < 0 && (
                                        <div className="detail">
                                            <span className="label">Overdue by</span>:<span className='label-inner' style={{color: 'red'}}>{Math.abs(Math.round(dueDateDiff))} {Math.abs(Math.round(dueDateDiff)) === 1 ? 'day' : 'days'}</span>
                                        </div>
                                    )}
                                    <div className="detail">
                                        <span className="label">Due Date</span>:<span className='label-inner'>{selectedItem.due_date.slice(0, 10)}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Worker(s)</span>:<span className='label-inner'>{selectedItem.worker_names}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Total Expense</span>:<span className='label-inner'>₹{selectedItem.wage}</span>
                                    </div>
                                    {editable ?
                                        <>
                                            {advancePaid === 0 ?
                                                <>
                                                    <p className='label-2'>Advance paid?
                                                        <Switch checked={isChecked} onChange={this.handleToggle}/></p>
                                                </>
                                                :
                                                <div>
                                                    <div className="detail" style={{marginBottom: "20px"}}>
                                                        <span className='label'>Advance Paid</span>:<span className='label-inner'> ₹{advancePaid}</span>
                                                    </div>
                                                    <div className="detail">
                                                        <span className='label'>Advance Paid Date</span>:<span className='label-inner'>{dateOfPaid.slice(0, 10)}</span>
                                                    </div>
                                                </div>}
                                                {selectedItem.bill_paid || paidbills.get(selectedItem.work_id) ?
                                                    <p className='label-2'>Bill Paid ✅</p> :
                                                    <p className='label-2'>Bill Paid? <Switch onChange={this.handleBill}></Switch></p>
                                                }
                                        </>
                                        :
                                        <>
                                            <div className="detail">
                                                <span className="label">Advance Paid</span>:<span className='label-inner'>₹{advancePaid}</span>
                                            </div>
                                            <div className="detail">
                                                {selectedItem.bill_paid ? <p className='label'>Bill paid ✅</p> : <p className='label'>Bill paid ❌</p>}
                                            </div>
                                            <div className="detail">
                                                <span className="label">Advance Paid Date</span>:<span className='label-inner'>{dateOfPaid.slice(0, 10)}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="label">Print As PDF</span>:
                                                <button className='print-button' onClick={this.generatePDF}></button>
                                            </div>
                                        </>
                                    }
                                </div>
                                {isChecked ?
                                    <div>
                                        <input type='number'
                                                placeholder='Advance to be Paid'
                                                className='advance-input'
                                                value={this.state.enteredAdvance}
                                                onChange={(e) => {
                                                    this.setState({enteredAdvance: e.target.value});
                                                }}/>
                                        <input type='date'
                                                value={this.state.enteredDate.toISOString().split('T')[0]}
                                                className='advance-date-input'
                                                onChange={(e) => {
                                                    this.setState({enteredDate: new Date(e.target.value)});
                                                }} placeholder='Date'/>
                                        <button onClick={this.handleSubmit} className='advance-submit-bitton'>Submit</button>
                                    </div>
                                    : ''
                                }
                                <div className={this.state.editable ? "popup-piechart" :    "popup-piechart-admin"}>
                                    <p className='label-2'>Work Progress: </p>
                                    <ProgressChart
                                        percentage={selectedItem.total_subtasks !== 0 ? selectedItem.completed_subtasks : 0}
                                    />
                                    {this.state.editable ? <p>{""}</p> : <CommentBox workid={selectedItem.work_id}/>}
                                    {this.state.editable ? <p className='label-2'>Print As PDF : <button className='print-button' onClick={this.generatePDF}></button></p> : ""}
                                </div>
                            </div>
                            {this.state.editable ?
                                <div className='subtask-div'>
                                    <p className='label-2'>Sub Tasks: </p>
                                    <div className='subtask-table'>
                                        <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                            <Droppable droppableId="subtasks">
                                                {(provided) => (
                                                    <ol {...provided.droppableProps} ref={provided.innerRef}>
                                                        {selectedSubtasks.map((subtask, index) => (
                                                            <Draggable key={subtask.task_id}
                                                                        draggableId={String(subtask.task_id)}
                                                                        index={index}>
                                                                {(provided) => (
                                                                    <div>
                                                                        <div style={{display: "flex", alignItems: "center", columnGap: '3vw'}}>
                                                                            <li {...provided.draggableProps} {...provided.dragHandleProps}
                                                                                ref={provided.innerRef}>
                                                                                <div className='sub-star'>
                                                                                    <div>
                                                                                        {subtask.task_name}
                                                                                    </div>
                                                                                    
                                                                                </div>
                                                                            </li>
                                                                            <p className='p-ele'> | {subtask.weightage} %</p>
                                                                            <div className='undo-div'>
                                                                                <p className='p-ele'>Completed: {subtask.completed
                                                                                ? '✅' : '❌'}</p>
                                                                                {subtask.completed ? (
                                                                                    <div>
                                                                                        <button className='undo-btn' onClick={() => this.HandleUndo(subtask)}>Undo</button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <button className='undo-in'>Undo</button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <hr/>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </ol>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                    <p className='label-2'>Comments/Queries : </p>
                                    {this.state.selectedComments.map((comment, index) =>
                                        <CommentCard key={index} comment={comment} />
                                    )}

                                </div>
                                :
                                
                                <div>
                                    <p className='label'>Sub Tasks: </p>
                                    <div style={{marginLeft: "20px"}}>
                                        {selectedSubtasks.map((subtask, index) => <p key={index}>{index + 1}.{subtask.task_name}</p>)}
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </PopUp>
            </>
        );
    }

}

export default TaskTable;