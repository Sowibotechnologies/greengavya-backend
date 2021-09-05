import React from 'react';
import './Snackbar.css';

class Snackbar extends React.Component{
    state={
        status:'',
        message:''
    }
    componentDidMount(){
        this.setState({
            msg_state: false
        });
    }
    componentWillReceiveProps(){
        if(this.props.msg_state === true){
            this.setState({
                status: this.props.status,
                message: this.props.message,
                msg_state:true
            });
            setTimeout(()=>{    
                this.setState({
                    msg_state:false
                });
            }, 3000);
        }
        if(this.props.msg_state === false){
            this.setState({
                msg_state: false
            });
        }
    }
    renderLogic(){
        if(this.state.msg_state){
            switch(this.state.status){
                case 'Success':
                    return <SuccessBar context={this} status={this.state.status} message={this.state.message}/>
                case 'Failed':
                    return <FailedBar status={this.state.status} message={this.state.message}/>
                case 'Info':
                    return <InfoBar status={this.state.status} message={this.state.message}/>
                case 'Warning':
                    return <WarningBar status={this.state.status} message={this.state.message}/>
            }
        }
    }
    render(){
        return(
            <React.Fragment>
                <div className="container-fluid" style={{position:'fixed', zIndex:'999',right:'0',bottom:'30px'}}>
                    <div class="toast__container">
                        {this.renderLogic()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const SuccessBar = (props) =>{
    return(
        <div class="toast__cell show" id="snack">
            <div class="toast toast--green">
                <div >
                <img alt="Success icon" class="toast__icon" src="/images/success.png" />
                </div>
                <div class="toast__content">
                    <p class="toast__type">{props.status}</p>
                    <p class="toast__message">{props.message}</p>
                </div>
                <div class="toast__close" onClick={(e)=>{props.context.setState({msg_state:false})}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" enable-background="new 0 0 15.642 15.642">
                    <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
const FailedBar = (props) =>{
    return(
        <div class="toast__cell show" id="snack">
            <div class="toast toast--red">
                <div >
                <img alt="Failed icon" class="toast__icon" src="/images/failed.png" />
                </div>
                <div class="toast__content">
                    <p class="toast__type">{props.status}</p>
                    <p class="toast__message">{props.message}</p>
                </div>
                <div class="toast__close" onClick={(e)=>{props.context.setState({msg_state:false})}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" enable-background="new 0 0 15.642 15.642">
                    <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
const InfoBar = (props) =>{
    return(
        <div class="toast__cell show" id="snack">
            <div class="toast toast--blue">
                <div >
                <img alt="Info icon" class="toast__icon" src="/images/info.png" />
                </div>
                <div class="toast__content">
                    <p class="toast__type">{props.status}</p>
                    <p class="toast__message">{props.message}</p>
                </div>
                <div class="toast__close" onClick={(e)=>{props.context.setState({msg_state:false})}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" enable-background="new 0 0 15.642 15.642">
                    <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
const WarningBar = (props) =>{
    return(
        <div class="toast__cell show" id="snack">
            <div class="toast toast--yellow">
                <div >
                <img alt="Warning icon" class="toast__icon" src="/images/warning.png" />
                </div>
                <div class="toast__content">
                    <p class="toast__type">{props.status}</p>
                    <p class="toast__message">{props.message}</p>
                </div>
                <div class="toast__close" onClick={(e)=>{props.context.setState({msg_state:false})}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" enable-background="new 0 0 15.642 15.642">
                    <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
export default Snackbar;