import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';
import './Login.css';
import HeaderSmall from '../Header/HeaderSmall';
import Cookies from 'js-cookie';

class Register extends React.Component{
    state={
        msg:'',
        popupMessage : false,
        cartCount:0,
        Capslock:false,
        firstnameerr:false,
        lastnameerr:false,
        emailerr:false,
        phoneerr:false,
        passworderr:false,
        confirmpassworderr:false,
        passwordmismatcherr:false,
    }

    componentDidMount(){
        document.title = "Create New Customer Account";
        this.getCart();
    }
    handleSubmit(e){
        e.preventDefault();
        var err;
        var data = e.target;
        var errorList = {
            firstnameerr:false,
            lastnameerr:false,
            emailerr:false,
            phoneerr:false,
            passworderr:false,
            confirmpassworderr:false,
            passwordmismatcherr:false,
        }
        var regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
		//password regex -> (?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,10})$
        if(data.fname.value === "" || data.fname.value.length < 3 || data.fname.value.length > 25){
            errorList.firstnameerr = true
        }
        if(data.lname.value === "" || data.lname.value.length < 1 || data.lname.value.length > 16){
            errorList.lastnameerr = true
        }
        if(data.email.value === "" || data.email.value.length < 1 || data.email.value.length > 35 || !regex.test(data.email.value)){
            errorList.emailerr = true;
        }
        if(data.phone.value === "" || data.phone.value.length < 6 || data.phone.value.length > 15){
            errorList.phoneerr = true;
        }
        if(data.password.value === "" || data.password.value.length < 8 || data.password.value.length > 16){
            errorList.passworderr = true;
        }
        if(data.password2.value === ""){
            errorList.confirmpassworderr = true;
        }
        if(data.password2.value !== ""&&data.password.value !== ""){
            if(data.password.value === data.password2.value){
                errorList.passwordmismatcherr = false
            }else{
                errorList.passwordmismatcherr = true
            }
        }

        this.setState({
            firstnameerr:errorList.firstnameerr,
            lastnameerr:errorList.lastnameerr,
            emailerr:errorList.emailerr,
            phoneerr:errorList.phoneerr,
            passworderr:errorList.passworderr,
            confirmpassworderr:errorList.confirmpassworderr,
            passwordmismatcherr:errorList.passwordmismatcherr,
        })
        var errorFree = false;
        for(err in errorList){
            if(errorList[err] === true){
                errorFree = true;
            }
        }
        if(errorFree){
            //invalid
        }else{
            fetch('/api/user/register',{
                method:'POST',
                body : JSON.stringify({username:data.fname.value, lastname:data.lname.value,phone:data.phone.value,email:data.email.value,password:data.password.value,referral:data.referral.value}),
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }else if(res.status === 404){
                    throw "Already registered with this Email ID!!";
                }else{
                    throw "Something went wrong with your registration data!!!";
                }
            })
            .then(result => {
                //success
                this.setState({
                    msg:result.message,
                    popupMessage : true
                })
            })
            .catch(err => {
                alert(err);
            })
        }
        

        // var data = e.target;
        // if(data.password.value === data.password2.value){
        //     fetch('/api/user/register',{
        //         method:'POST',
        //         body : JSON.stringify({username:data.fname.value, lastname:data.lname.value,phone:data.phone.value,email:data.email.value,password:data.password.value,referral:data.referral.value}),
        //         headers: {
        //             "Content-Type": "application/json",
        //             // "Content-Type": "application/x-www-form-urlencoded",
        //         }
        //     })
        //     .then(res => {
        //         if(res.status === 200){
        //             return res.json();
        //         }else if(res.status === 404){
        //             throw "Already registered with this Email ID!!";
        //         }else{
        //             throw "Something went wrong with your registration data!!!";
        //         }
        //     })
        //     .then(result => {
        //         //success
        //         this.setState({
        //             msg:result.message,
        //             popupMessage : true
        //         })
        //     })
        //     .catch(err => {
        //         alert(err);
        //     })
        // }else{
        //     this.setState({
        //         msg:"Password Mismatch!"
        //     })
        // }
    }
    getCart(){
        var key = Cookies.get('_cid');
        if(key != null){
            fetch('/api/cart/showCart',{
                method : 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                        "_cid":key
                    }
                })
            .then(res => res.json())
            .then(result => {
                if(result.result != null){
                    this.setState({
                        cartCount:result.result.length
                    })
                }
            })
        }
    }

    handleMessage(){
        //console.log("clicked");
        this.setState({
            popupMessage:false
        })
        this.props.history.push('/login');
    }

    CheckCAPS(e){
        let capslock = e.getModifierState("CapsLock");
        this.setState({
            Capslock:capslock
        })
    }

    render(){
        return(
            <React.Fragment>
                {
                    this.state.popupMessage ? <Message okbtn={this.handleMessage.bind(this)}/> : null
                }
               <div className="c_respo_nav-large">
                    <Header cartCount={this.state.cartCount}/>
                </div>
                <div className="c_respo_nav-small">
                    <HeaderSmall cartCount={this.state.cartCount}/>
                </div>
               <Navigation />
               <div className="container login-container">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <h3 className="login-head">Create an Account</h3>
                        <div className="reg-container">
                            <h4 className="reg-form-subtitle">Personal Information</h4>
                            <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <p className="reg-label">First Name *</p>
                                        <input type="text" name="fname" id="fname" style={{textTransform: "capitalize"}} className="login-textfield"/>
                                        {
                                            this.state.firstnameerr ? <span className="reg-error-msg">Must have atleast 3-15 characters</span> : <span>&nbsp;</span>
                                        }
                                        
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <p className="reg-label">Last Name *</p>
                                        <input type="text" name="lname" id="lname" style={{textTransform: "capitalize"}} className="login-textfield"/>
                                        {
                                            this.state.lastnameerr ? <span className="reg-error-msg">Must have atleast 1-15 characters</span> : <span>&nbsp;</span>
                                        }
                                        
                                    </div>
                            </div>
                            <p className="reg-label">Email Address *</p>
                            <input type="email" name="email" id="email" className="login-textfield"/>
                            {
                                this.state.emailerr ? <span className="reg-error-msg">Must enter a valid email</span> : <span>&nbsp;</span>
                            }
                            <p className="reg-label">Phone number *</p>
                            <input type="number" name="phone" id="phone"  className="login-textfield"/>
                            {
                                this.state.phoneerr ? <span className="reg-error-msg">Must have atleast 6-15 characters</span> : <span>&nbsp;</span>
                            }
                            
                            <h4 className="reg-form-subtitle">Login Information</h4>
                            <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <p className="reg-label">Password *</p>
                                        <input type="password" name="password" id="password" onKeyUp={this.CheckCAPS.bind(this)}  className="login-textfield"/>
                                        {
                                            this.state.passworderr ? <span className="reg-error-msg">Your password must be 8-16 characters.</span> : <span>&nbsp;</span>
                                        }
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <p className="reg-label">Confirm Password *</p> 
                                        <input type="password" name="password2" id="password2" onKeyUp={this.CheckCAPS.bind(this)}  className="login-textfield"/>
                                        {
                                            this.state.passwordmismatcherr ? <span className="reg-error-msg">Password mismatch</span> : <span>&nbsp;</span>
                                        }
                                        {
                                            this.state.confirmpassworderr ? <span className="reg-error-msg">Confirm password not be empty!</span> : <span>&nbsp;</span>
                                        }
                                    </div>
                            </div>
                            {
                                this.state.Capslock ? <p style={{color:'red'}}>Warning: CAPS lock enabled</p> : <p>&nbsp;</p>
                            }
                            
                            <p className="reg-label">Referral Code </p>
                            <input type="text" name="referral" id="referral" maxLength="10" className="login-textfield"/>
                            
                        </div>
                        <p style={{marginTop:'20px',color:'#a94442'}}>* Required Fields <span style={{float:'right'}}>{this.state.msg}</span></p>
                        <Link to={'login'}>&#10094;&#10094;&nbsp;Back</Link>
                        <button className="login-btn" type="submit">Submit</button>
                   </form>
                </div>
               <Footer />
            </React.Fragment>
        )
    }
}

const Message = (msg) => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'725px',height:'240px'}}>
                <div style={{padding:'20px',textAlign:'center'}}>
                    <h2 className="text-center" style={{color:'#6495ed',borderBottom: '2px solid #6495ed',paddingBottom:' 12px',fontSize:'26px'}}>
                        <img src={"./images/success_tick.png"}/>&nbsp;{"A verification link has been sent to your email account "}
                    </h2>
                    <h4 style={{textAlign: 'center',marginTop:'24px',color: '#6495ee'}}>Please click on the link that has just been sent to your email account to verify your email and continue the registration process. You will receive a verification email from us within 10 minutes</h4>
                    <button className="btn" style={{marginTop: '20px',width: '100px',backgroundColor: 'cornflowerblue',color: 'white'}} onClick={msg.okbtn.bind(this)}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default Register;