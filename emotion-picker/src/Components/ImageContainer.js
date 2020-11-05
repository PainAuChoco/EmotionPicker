import '../App.css';
import React from "react";

class ImageContainer extends React.Component {
    render() {
        return (
            <img
                src={this.props.url}
                width={this.props.width}
                height={this.props.height} 
            />
        )
    }
}

export default ImageContainer;