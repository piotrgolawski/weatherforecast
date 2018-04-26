import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class AutomaticPositionButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        navigator.geolocation.getCurrentPosition(position => {
            this.props.getPositionCallback(position);
        });
    }

    render() {
        return (
            <button className="btn" onClick={this.handleClick}>
                Get forecast by my position
            </button>
        );
    }
}

ReactDOM.render(
    <AutomaticPositionButton/>,
    document.getElementById('root')
);
export default AutomaticPositionButton;