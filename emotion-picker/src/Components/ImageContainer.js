import '../App.css';
import React from "react";

class ImageContainer extends React.Component {

    state = {
        width: 0,
        height: 0
    }

    componentDidMount() {
        this.computeRatio()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            this.computeRatio()
        }
    }

    computeRatio = () => {
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

    render() {
        return (
            <div id="currentPainting">
                <img
                    src={this.props.url}
                    width={this.state.width}
                    height={this.state.height}
                />
            </div>
        )
    }
}

export default ImageContainer;