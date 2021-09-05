import React from 'react';
import Header from '../Header/Header';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

class Resetpassword extends React.Component{
    state = {
        password:"",
        confirmpassword:"",
        v_code:'',
        email:'',
        errorMessage:false,
        loading:false
    }
    componentDidMount(){
        document.title = "Reset password";
        this.setState({
            v_code:this.props.match.params.verif_code,
            email:this.props.match.params.email
        })
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        const {password, confirmpassword} = this.state;
        if(password === "" && confirmpassword === ""){
            //console.log(null);
        }else{
            if(password !== confirmpassword){
                this.setState({
                    errorMessage :true
                })
            }else{
                this.setState({
                    loading:true,
                    errorMessage:false
                })
                
                fetch('/api/user/resetpassword',{
                    method:'POST',
                    body : JSON.stringify({verify_code:this.state.v_code,email:this.state.email,password:this.state.password}),
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                    }
                })
                .then(res => {
                    if(res.status === 200){
                        return res.json();
                    }else{
                        throw "We were unable to find an account linked to this email";
                    }
                })
                .then(result => {
                    this.setState({
                        loading:false
                    })
                    alert(result.message);
                    window.location = "http://greengavya.com";
                })
                .catch(e => {alert(e);})
            }
        }
    }
    render(){
        return(
            <React.Fragment>
                {
                    this.state.loading ? <Popupmessage msg="Please wait..."/> : null
                }
                <div className="container-fluid">
                    {/* <Header cartCount={this.state.cartCount}/> */}
                    {/* <Navigation /> */}
                    <div className="container forgot-pwd-container">
                        <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12">

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-10 col-xs-12">
                            <p style={{textAlign:'center'}}><img src={window.location.origin + "/logo/ic_gavya_transparent.png"} style={{width:'150px'}}/></p>
                            <h3 className="login-head">Reset Password</h3>
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <p className="reg-label">Enter your new Password *</p>
                                <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange.bind(this)} minLength="8" maxLength="25" required className="login-textfield"/>
                                <p className="reg-label">Confirm Password *</p>
                                <input type="password" name="confirmpassword" id="confirmpassword" value={this.state.confirmpassword} onChange={this.handleChange.bind(this)} minLength="8" maxLength="25" required className="login-textfield"/>
                                {
                                    this.state.errorMessage ? <p style={{textAlign:'right',color:'#a94442',marginTop:'10px'}}>Password mismatch!</p> : null
                                }
                                <div style={{textAlign:'right'}}>
                                    <button className="forgot-btn" type="submit" style={{marginTop:'10px'}} >Reset now</button>
                                </div>
                            </form>
                            <p style={{paddingTop:'30px'}}><a href="http://greengavya.com">Back to Shopping</a></p>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12">

                        </div>
                        
                    </div>
                    {/* <Footer /> */}
                </div>
            </React.Fragment>
        )
    }
}

const Popupmessage = (msg) => {
    return(
        <div className="popup">
            <div className="popup-inner" style={{width:'230px',height:'100px',backgroundColor:'transparent',textAlign:'center',color:'#fff'}}>
                <h3>{msg.msg}</h3>
            </div>
        </div>
    )
}

export default Resetpassword;