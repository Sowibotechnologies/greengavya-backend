import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './Login.css';
import { Link } from 'react-router-dom';

class Forgotpassword extends React.Component{
    state = {
        email:''
    }

    componentDidMount(){
        document.title = "Forgot password";
    }

    handleChange(e){
        this.setState({
            email:e.target.value
        })
    }
    handleSubmit(){
        if(this.state.email !== ""){
            fetch('/api/user/resetpasswordmail',{
                method:'POST',
                body : JSON.stringify({email:this.state.email}),
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                }
            }).then(res => res.json())
            .then(result => {
                alert(result.message);
            })
        }else{
            alert("Please enter email address associated with your Green Gavya account");
        }
        
    }
    
    render(){
        return(
            <React.Fragment>
               <Header/>
               <Navigation />
               <div className="container login-container">
                    <div className="forgotpwd-container">
                        <h3 className="login-head">Forgot Your Password?</h3>
                        <h4 className="reg-form-subtitle">Retrieve your password here</h4>
                        <p>Please enter your email address below. You will receive a link to reset your password.</p>
                        <p>Email Address *</p>
                        <input type="email" name="email" id="email" className="login-textfield" onChange={this.handleChange.bind(this)}/>
                   </div>
                   <p style={{marginTop:'20px',color:'#a94442'}}>* Required Fields</p>
                   <Link to={'login'}>Back to Login</Link>
                   <button className="login-btn" onClick={this.handleSubmit.bind(this)}>Submit</button>
                </div>
               <Footer />
            </React.Fragment>
        )
    }
}

export default Forgotpassword;