import React, {useState, useEffect} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./WorkReport.css"
import { useNavigate } from 'react-router-dom';



function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#640000", border: "solid #640000 1px", borderRadius: '5px' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#640000", border: "solid #640000 1px", borderRadius: '5px' }}
      onClick={onClick}
    />
  );
}


const WorkReport = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/db/getimages')
            .then(response => response.json())
            .then(data => setData(data.filter(x=>x.links.length>0)));
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
      };

    
    return (
      <>
        <div className='report-grid'>
          <button className="go-back-button" onClick={() => navigate(-1)}>Home</button>
          <h1 className='report-title'>Work Reports</h1>
          <hr className="heading-line"/>
          <div className='grid-con'>
            {data.map((item, index) => (
              <div key={index}>
                <h2 className='work-name'>Work-Name: {item.workname}</h2>
                <Slider {...settings}>
                  {item.links.map((link, i) => (
                    <div key={i}>
                      <div className='img-grid'>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                        <img className='image-preview' src={link} alt="" />
                        </a>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            ))}
          </div>
        </div>
      </>
    );
}

export default WorkReport;