import React from 'react';

class Empty extends React.Component{
    render(){
        return(
            <React.Fragment>
                <div style={{textAlign:'center',marginTop:'150px',paddingBottom:'120px'}}>
                    <img src="/images/empty-box.svg" width="100" alt="empty"/>
                    <h4>No Open Orders available !</h4>
                </div>

            </React.Fragment>
        )
    }
}
export default Empty;