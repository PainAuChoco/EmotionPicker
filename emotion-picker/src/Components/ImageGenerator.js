import '../App.css';
import React from "react";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import $ from "jquery"

class ImageGenerator extends React.Component {

    state = {
        style: "portrait",
        emotion: "positive",
        number: 1,
        loading: false
    }

    componentDidUpdate(prevProps) {
        if (prevProps.imgIds !== this.props.imgIds) {
            this.setState({ loading: false })
        }
    }

    handleGenerateClick = () => {
        this.setState({ loading: true })
        var style = $('#style').val()
        var number = $('#number').val()
        var emotion = $('#emotion').val()

        this.props.getGeneratedImages(style, number, emotion)
    }


    render() {
        return (
            <div id="generator">
                <div id="form">
                    <select id="style" name="style" className="select form-control mr-1">
                        <option value="portrait">Portrait</option>
                        <option value="abstract">Abstract</option>
                        <option value="flower-painting">Flower</option>
                        <option value="landscape">Landscape</option>
                    </select>

                    <select id="emotion" name="emotion" className="select form-control">
                        <option value="positive">positive</option>
                        <option value="negative">negative</option>
                        <option value="neutral">neutral</option>
                    </select>

                    <select id="number" name="number" className="select form-control ml-1">
                        <option value="2">2</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="32">32</option>
                        <option value="64">64</option>
                        <option value="128">128</option>
                    </select>
                </div>
                <Button variant="contained" className="noOutline mt-1 ml-1" onClick={this.handleGenerateClick} color="primary">Generate Image</Button>
                <div>
                    {this.state.loading &&
                        <div className="spinner-border mt-2" role="status"></div>
                    }
                    <Grid item xs={12}>
                        <Grid className="mt-2" container justify="flex-start" spacing={1}>
                            {this.props.show && this.props.imgIds.map((index, key) => (
                                <React.Fragment key={key}>
                                    <Grid key={key} item>
                                        <img src={index} />
                                    </Grid>
                                </React.Fragment>
                            ))
                            }
                        </Grid>
                    </Grid>
                </div>
            </div >
        )
    }
}

export default ImageGenerator;