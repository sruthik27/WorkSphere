import React, { useState } from "react";

const CommentBox = (props) => {
    const [comment, setComment] = useState("");  
    const HandleSubmit = () => {
        const jsonData = {
            work: props.workid,
            message: comment,
            who:"A"
        }
        // console.log(jsonData);
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(jsonData), // Convert JavaScript object to JSON
            redirect: 'follow'
        };

        fetch("/db/addquery", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        setComment("");
    }
    return(
        <div className='feedback'>
            <h2 className='popup-details1'>Comment: </h2>
            <input className='feedback-input' placeholder='Type Comment here...' value={comment} onChange={(e) => {
                setComment(e.target.value);
            }}/>
            <button className='send-button' onClick={HandleSubmit}>SEND</button>
        </div>
    )
}

export default CommentBox;