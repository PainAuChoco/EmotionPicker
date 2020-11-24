import '../App.css';
import React from "react";
import Button from '@material-ui/core/Button';

export default function VotingButtons({callbackClick}){

    const handleClick = (vote) => {
        callbackClick(vote)
    }

    return(
        <div id="votingButtons" className="d-flex justify-content-between">
            <Button className="mr-1 noOutline" variant="contained" color="primary" onClick={() => handleClick("Negative")} value="Negative">Negative</Button>
            <Button className="mr-1 ml-1 noOutline" variant="contained" color="primary" onClick={() => handleClick("Neutral")} value="Neutral">Neutral</Button>
            <Button className="ml-1 noOutline" variant="contained" color="primary" onClick={() => handleClick("Positive")} value="Positive">Positive</Button>
        </div>
    )
}