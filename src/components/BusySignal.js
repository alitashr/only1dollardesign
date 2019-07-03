import React, { Component } from 'react';

class BusySignal extends Component {
    busyLoader = {
        display:'block'
    };

    render() {
        let show = this.props.show;
        return (
             <div className="contentLoadingSingle" style={show ? this.busyLoader:null}></div>
        );
    }
}

export default BusySignal;