import '../App.css';
import React from "react";
import Button from '@material-ui/core/Button';

export default function VotingButtons({callbackClick}){

    const handleClick = (event) => {
        callbackClick(event.target.value)
    }

    return(
        <div id="votingButtons" className="d-flex justify-content-between">
            <Button className="mr-1" variant="contained" color="primary" onClick={handleClick} value="Negative">Negative</Button>
            <Button className="mr-1 ml-1" variant="contained" color="primary" onClick={handleClick} value="Neutral">Neutral</Button>
            <Button className="ml-1" variant="contained" color="primary" onClick={handleClick} value="Positive">Positive</Button>
        </div>
    )
}