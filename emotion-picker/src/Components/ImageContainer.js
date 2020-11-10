import '../App.css';
import React from "react";

class ImageContainer extends React.Component {

    state = {
        width: 0,
        height: 0,
        progress: 0
    }

    componentDidMount() {
        this.computeRatio()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            this.computeRatio()

            /*var self = this
            Image.prototype.load = function (url) {
                var thisImg = this;
                var xmlHTTP = new XMLHttpRequest();
                xmlHTTP.open('GET', url, true);
                xmlHTTP.responseType = 'arraybuffer';
                xmlHTTP.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
                xmlHTTP.onprogress = function (e) {
                    thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
                    console.log(thisImg.completedPercentage)
                    self.setState({
                        progress: thisImg.completedPercentage
                    })
                };
                xmlHTTP.onloadstart = function () {
                    thisImg.completedPercentage = 0;
                };
                xmlHTTP.send();
            };
            Image.prototype.completedPercentage = 0;

            var img = new Image();
            img.load(this.props.url);
            img.src = this.props.url*/
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