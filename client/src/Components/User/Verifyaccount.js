import React from 'react';
import { Link } from 'react-router-dom';
import './user.css';

class Verifyaccount extends React.Component{

    state ={
        code :'',
        completed:false
    }

    componentDidMount(){
        this.setState({
            code : this.props.match.params.verif_code
        })
        setTimeout(() => {
            this.EmailVerification(this.state.code);
        }, 100);
    }

    EmailVerification(v_code){
        fetch('/api/user/verifyaccount',{
            method:'POST',
            body : JSON.stringify({verify_code:v_code}),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        .then(res => {
            
            if(res.status == 200){
                setTimeout(() => {
                    this.setState({
                        completed:true
                    })
                }, 2000);
                
            }else if(res.status == 409){
                alert("Account already verified!!")
                window.location = "http://www.greengavya.com/";
            }else{
                alert("Something went wrong!!")
            }
        })
    }
    applyRedirect(){
        window.location = "http://www.greengavya.com/";
    }

    render(){
        return(
            <div>
                {
                    this.state.completed ? <ProcessSuccess applyRedirect={this.applyRedirect.bind(this)}/> : <Processing />
                }
            </div>
        )
    }
}

const Processing = () => {
    return(
        <div className="container user-verify-loading">
            <h3 className="text-center" style={{color:'#09d4a4',fontWeight:'200'}}>Green Gavya</h3>
            <h1 className="text-center" style={{color:'#09d4a4',fontWeight:'200'}}>Your account is verifying</h1>
            <h2 className="text-center" style={{color:'#09d4a4',fontWeight:'200'}}>Please wait...</h2>
            <h4 className="text-center" style={{marginLeft: '-18px',marginTop: '24px'}}><img src="../images/purchaseLoader.gif"/></h4>
        </div>
    )
}
const ProcessSuccess = (props) => {
    return(
        <div className="container user-verify-loading-success">
            <h1 className="text-center" style={{color:'#09d4a4',fontWeight:'200'}}>Successfully Verified</h1>
            <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" fill="none" cx="26" cy="26" r="25" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <div className="text-center">
                <p onClick={props.applyRedirect.bind(this)} style={{color: '#09d4a4',fontSize: '26px',fontWeight: '200',textDecoration:'underline',cursor:'pointer'}}>Continue Shopping</p>
            </div>
        </div>
    )
}

export default Verifyaccount;