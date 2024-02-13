import React, { useState } from 'react';
import './ToolTip.css';

function Tooltip({ text, children }) {

    const [isVisiable, setIsVisiable] = useState(false);
    return (
        <div className='tooltip-div'
            onMouseEnter={() => {setIsVisiable(true)}}
            onMouseLeave={() => {setIsVisiable(false)}}
        >
            {children}
            {isVisiable && <p className='tooltip-p'>{text}</p> }
        </div>
    );
}

export default Tooltip;