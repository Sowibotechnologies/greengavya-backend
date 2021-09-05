import React from 'react';
import './Empty.css';

class Empty extends React.Component{
    render(){
        return(
            <React.Fragment>
                <div style={{textAlign:'center',marginTop:'150px'}}>
                    <img className="heart-beat" src="/images/empty-box.svg" width="150" alt="empty"/>
                    <h1 style={{color:'#000'}}>No records found !</h1>
                </div>

            </React.Fragment>
        )
    }
}
export default Empty;