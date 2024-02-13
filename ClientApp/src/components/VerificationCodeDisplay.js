import React, { useState, useEffect } from 'react';
import './VerificationCodeDisplay.css';

const VerificationCodeDisplay = () => {
  const [verificationCode, setVerificationCode] = useState([]);

  useEffect(() => {
    const getVerificationCode = async () => {
      try {
        const response = await fetch('/db/getverificationcode');

        if (response.ok) {
          const data = await response.json();
          let digits = data.toString().split('');
          setVerificationCode(digits);
        } else {
          console.error('Failed to fetch verification code');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    getVerificationCode();
  }, []); // The empty dependency array ensures the effect runs only once, similar to componentDidMount

  return (
    <div>
      <div className="verification-code-container">
        <div className='verification-div'>
          {verificationCode.map((digit, index) => (
            <div key={index} className="digit-box">
              {digit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeDisplay;
