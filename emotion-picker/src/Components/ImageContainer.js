import '../App.css';
import React from "react";

class ImageContainer extends React.Component {

    state = {
        width: 0,
        height: 0
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            var ratio = this.props.height / this.props.width
            var newWidth, newHeight
            if (this.props.width < this.props.height) {
                newHeight = 400
                newWidth = newHeight / ratio
            }
            else {
                newWidth = 400
                newHeight = newWidth * ratio
            }
            this.setState({
                width: newWidth,
                height: newHeight
            })
        }
    }

    handleLoad = (e) => {
        console.log(e)
    }

    render() {
        return (
            <div id="currentPainting">
                <img
                    src={this.props.url}
                    width={this.state.width}
                    height={this.state.height}
                    onLoad={this.handleLoad}
                />
            </div>
        )
    }
}

export default ImageContainer;