import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './Login.css';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import HeaderSmall from '../Header/HeaderSmall';

class 
Login extends React.Component{

    state ={
        email:'',
        password:'',
        prePath:'',
        errorMessage:false,
        cartCount:0,
        processing:false,
        Capslock:false
    }

    componentDidMount(){
        document.title = "Customer login";
        var prePath = this.props.match.params.path;
        this.setState({prePath:prePath});
        this.getCart();
        var logged = this.CheckAuth();
        if(logged){
            this.props.history.push('/');
        }
    }
    componentWillReceiveProps(){
        this.getCart();
    }
    handleInput(e){
        this.setState({
            [e.target.name]: e.target.value
        })
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
    HandleLogin(e){
        this.setState({
            processing:true
        })
        e.preventDefault();
        const {email,password} = this.state;
        if(email !== ""&&password !== ""){
            fetch('/api/user/login',{
                method:'POST',
                body : JSON.stringify({email:email,password:password}),
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            .then(res => res.json())
            .then(result => {
                if(result.status == 200){
                    Cookies.set("_token", result.token, {expires:1});
                    Cookies.set("sessionID", result.csrf_token, {expires:1});
                    if(this.state.prePath === "billing"){
                        this.props.history.push('/billing');
                    }else if(this.state.prePath === "confirmorder"){
                        this.props.history.push('/confirmorder');
                    }else{
                        this.props.history.push('/');
                    }
                }else{
                    this.setState({
                        errorMessage:true
                    })
                }
                this.setState({
                    processing:false
                })
            })
            .catch(e => {
               // console.log(e);
            })
        }else{
            this.setState({
                processing:false
            })
            alert("Please provide a Email and Password");
        }
    }
    CheckAuth(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        if(token !== undefined&&session !== undefined){
            return true;
        }else{
            return false;
        }
    }
    CheckCAPS(e){
        let capslock = e.getModifierState("CapsLock");
        this.setState({
            Capslock:capslock
        })
    }
    render(){
        const {cartCount,processing} = this.state;
        return(
            <React.Fragment>
                {
                    processing ? <Popupmessage msg="Please wait..."/> : null
                }
                <div className="c_respo_nav-large">
                    <Header cartCount={cartCount}/>
                </div>
                <div className="c_respo_nav-small">
                    <HeaderSmall cartCount={cartCount}/>
                </div>
               <Navigation />
               <div className="container login-container">
                   <h3 className="login-head">Login or Create an Account</h3>
                   <div className="row login-container-acc">
                        <div className="col-lg-6 col-md-6">
                            <div className="login-container-section">
                                <h4>New Customers</h4>
                                <p>By creating an account with our store,
                               you will be able to move through the checkout process faster,
                               store multiple shipping addresses,
                               view and track your orders in your account and more.</p>
                               <div>
                                    {/* <div className="login-container-line"></div> */}
                               </div>
                            </div>
                            <div className="login-buttonblocks">
                                <Link to={'/register'}><button className="login-btn">Create an Account</button></Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="login-container-section">
                                <h4>Registered Customers</h4>
                                <p style={{margin:'0px'}}>If you have an account with us, please log in.</p>
                                <p>If you don't verify your email id, please verify before you log in. <img src={ window.location.origin + "/icons/ic_help.png"} height="16" className="login-helpicon" title="Please sign in to your registered email"/></p>
                                <div className="login-container-form">
                                    <p>Email Address *</p>
                                    <input type="email" name="email" id="email" className="login-textfield" minLength="2" maxLength="50" value={this.state.email} onChange={this.handleInput.bind(this)}/>
                                    <p style={{marginTop:'5px'}}>Password *
                                    {
                                        this.state.Capslock ? <span style={{color:'red',float:'right'}}>Warning: CAPS lock enabled</span> : null
                                    }
                                    </p>
                                    <input type="password" name="password" id="password" className="login-textfield" maxLength="50" value={this.state.password} onChange={this.handleInput.bind(this)} onKeyUp={this.CheckCAPS.bind(this)}/>
                                    
                                    
                                    {
                                    this.state.errorMessage ? <p style={{color:'#a94442',fontWeight:'400'}}>{"You have entered an invalid username or password"}</p> : <p>&nbsp;</p>
                                }
                                </div>
                                <p className="login-required">* Required Fields</p>
                                <Link to={'/forgotpassword'} className="login-forgot-link">Forgot Your Password?</Link>
                                
                            </div>
                            <div className="login-buttonblocks">
                                <button className="login-btn"  onClick={this.HandleLogin.bind(this)}>Login</button>
                            </div>
                        </div>
                   </div>
                   <div style={{paddingBottom:'50px'}}>
                       <Link to={'/'}>&#10094;&#10094;&nbsp;Back</Link>
                   </div>
               </div>
               <Footer />
            </React.Fragment>
        )
    }
}

const Popupmessage = (msg) => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'230px',height:'100px',backgroundColor:'transparent',textAlign:'center',color:'#fff'}}>
                <img src={window.location.origin + '/images/dot_spin.svg'} height="44"/>
                <h3>{msg.msg}</h3>
            </div>
        </div>
    )
}

export default Login;