import React, { useRef } from 'react';
import StatsLineChart from './statsLineChart';    

const StatsRow = ({ chart1Data, chart1yTitle, chart2Data, chart2yTitle, rowTitle }) => {
    const rowRef = useRef(null);

    const toggleRow = () => {
        if (rowRef.current.style.display === "none") {
            rowRef.current.style.display = "flex";
        } else {
            rowRef.current.style.display = "none";
        }
    };

    return (
    <div>
        <div
            onClick={toggleRow}
            style={{
                backgroundColor: '#1e1e2e',
                padding: '2%',
                borderRadius: '5px',
                fontSize: '30px',
                fontWeight: 'bold',
                textAlign: "center",
                color: '#fff',
                cursor: "pointer",
            }}
        >
            <text>{rowTitle}</text>
        </div>
        <div
            ref={rowRef}
            style={{
                backgroundColor: "white",
                display: "flex",
                paddingBottom: "5%",
            }}
        >
            <div style={{width: "50%"}}>
                <StatsLineChart 
                    data={chart1Data}
                    yTitle={chart1yTitle}
                />
            </div>
        </div>
    </div>
    )
}


export default StatsRow;
