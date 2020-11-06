import '../App.css';
import React from "react";
import Button from '@material-ui/core/Button'
import { ButtonGroup } from '@material-ui/core';

export default function DirectoriesButtons({ handleDirectorySelection }) {
    return (
        <div>
            <div style={{margin: "1em"}}>Pick a painting genre</div>
            <div>
                <ButtonGroup>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("abstract")}>Abstract</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("animal-painting")}>Animal Painting</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("cityscape")}>CityScape</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("figurative")}>Figurative</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("flower-painting")}>Flower Painting</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("genre-painting")}>Genre Painting</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("landscape")}>Landscape</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("marina")}>Marina</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("mythological-painting")}>Mythological Painting</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("nude-painting-nu")}>Nude Painting</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("portrait")}>Portrait</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("still-life")}>Still Life</Button>
                    <Button color="primary" variant="contained" onClick={() => handleDirectorySelection("symbolic-painting")}>Symbolic Painting</Button>
                </ButtonGroup>
            </div>
        </div>
    )
};