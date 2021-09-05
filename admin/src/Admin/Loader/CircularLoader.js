import React from 'react';
import './CircularLoader.css';

class CircularLoader extends React.Component{
    render(){
        return(
        <div>
            <div class="spinner-svg">
                <img alt="Spinner" src="/images/Preloaders/spinner.svg" width="42"/>
            </div>
        </div>

        )
    }
}
export default CircularLoader;