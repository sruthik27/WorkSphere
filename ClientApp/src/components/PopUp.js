import React from "react";

const PopUp = (props) => {
   return(props.trigger) ? (
       <div className="popUp-head">
           <div className="popup-inner">
               {/* <h1 className="close-btn">x</h1> */}
               {props.children}
           </div>
       </div>
   ) : null;
}

export default PopUp;
