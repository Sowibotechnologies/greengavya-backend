import React from 'react';
import './Loader.css';

class GooeyLoader extends React.Component{
    render(){
        return(
            <div className="text-center" style={{marginTop:'50px'}}>
                <img alt="Spinner" src="/images/Preloaders/gooey-spinner.svg" width="70"/>
            </div>
        )
    }
}
export default GooeyLoader;