import React, { Component } from 'react';
import {ContentLoadingSignal} from './StyledComponents';

class BusySignal extends Component {
    busyLoader = {
        display:'block'
    };

    render() {
        let show = this.props.show;
        return (
             <ContentLoadingSignal style={show ? this.busyLoader:null}></ContentLoadingSignal>
        );
    }
}

export default BusySignal;