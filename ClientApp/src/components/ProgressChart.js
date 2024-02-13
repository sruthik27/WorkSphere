import React, { Component } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class ProgressChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            percentage: this.props.percentage,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.percentage !== this.props.percentage) {
            this.setState({ percentage: this.props.percentage });
        }
    }

    render() {
        const { percentage } = this.state;

        return (
            <div style={{ width: '100px', height: '100px' }}>
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage.toFixed(2)}%`}
                    styles={buildStyles({
                        textColor: '#000',
                        pathColor: percentage===100?'#4bfd54':'ff5722',
                        trailColor: '#d6d6d6',
                    })}
                />
            </div>
        );
    }
}

export default ProgressChart;