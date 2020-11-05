import '../App.css';
import React from "react";

class ImageContainer extends React.Component {
    render() {
        return (
            <div id="currentPainting">
                <img
                    src={this.props.url}
                    width={this.props.width}
                    height={this.props.height}
                />
            </div>
        )
    }
}

export default ImageContainer;