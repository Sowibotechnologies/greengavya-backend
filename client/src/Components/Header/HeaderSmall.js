import React from 'react';
import { Link,withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

class HeaderSmall extends React.Component{
    state = {
        authenticated:false,
        username:'',
        cartCount:0,
        searchword:''
    }

    componentDidMount(){
        this.CheckAuth();
        setTimeout(() => {
            this.getUsername();
            this.setState({
                cartCount:this.props.cartCount
            })
        }, 100);
    }

    componentWillReceiveProps(){
        this.CheckAuth();
        setTimeout(() => {
            this.setState({
                cartCount:this.props.cartCount
            })
        }, 100);
        
    }
    handleSearchButton(){
        this.props.history.push({
            pathname: '/',
            search: '?search='+this.state.searchword,
            state: { detail: this.state.searchword}
          })
    }

    handleSearchTextInput(e){
        this.setState({
            searchword:e.target.value
        })
    }

    Logout(){
        // Cookies.remove('_token', { path: '' });
        // Cookies.remove('sessionID', { path: '' });
        // window.location="/";
        this.props.history.push("/logout");
    }

    getUsername(){
        if(this.state.authenticated){
            var token = Cookies.get('_token');
            fetch('/api/user/getusernamebytoken',{
                headers:{
                    "token" : token
                }
            })
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }
            })
            .then(result => {
               this.setState({
                   username:result.name
               })
            })
        }
    }

    CheckAuth(){
        var token = Cookies.get("_token");
        var session = Cookies.get("sessionID");
        if(token !== undefined&&session !== undefined){
            //validate user from BE
            this.setState({
                authenticated : true
            })
        }else{
            this.setState({
                authenticated : false
            })
        }

    }
    onEnterPress(e){
        if(e.keyCode === 13){
            this.handleSearchButton();
        }
    }
    closeSearch(){
        this.setState({
            searchword:''
        })
        this.props.history.push('/');
    }
    openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }
      
    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }
    gotoCart(){
        this.props.history.push('/cart');
    }
    render(){
        return(
            <React.Fragment>
                <div id="mySidenav" className="sidenav">
                    <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav.bind(this)}>&times;</a>
                    
                    <div className="sm-header-user-profile">
                        <img src={ window.location.origin + "/icons/ic_user_32.png"}/>
                        {
                            this.state.authenticated ?
                            <LoggedHead username={this.state.username}/>
                            :
                            <h4 className="sm-header-user-welcome">Hello, Sign In</h4>
                        }
                    </div>
                    <Link to={'/'} onClick={this.closeNav.bind(this)}>Home</Link >
                    <Link to={'/myorders'} onClick={this.closeNav.bind(this)}>My orders</Link >
                    <div style={{ borderTop: '1px solid #fff'}}>
                        {
                            this.state.authenticated ?
                            <LoggedMob logout={this.Logout.bind(this)}/>
                            :
                            <NotLogged />
                        }
                    </div>
                </div>

                <div className="sm-header">
                    <span style={{fontSize:'30px',cursor:'pointer',marginLeft:'6px'}}><span onClick={this.openNav.bind(this)}>&#9776;</span> <img src={ window.location.origin +"/logo/ic_logo_horizontal.png"} className="sm-header-logo" onClick={() => {window.location="/"}}/></span>
                    <span><span className="badge sm-header-cartcount">{this.state.cartCount}</span><img src={ window.location.origin +"/icons/ic_cart_48.png"} style={{position:'absolute',right:'2px'}} onClick={this.gotoCart.bind(this)}/></span>
                    <br/>
                    <div style={{textAlign:'center'}}>
                        <div className="sm-header-searchbar input-group"><input type="text" value={this.state.searchword} autoComplete="off" onChange={this.handleSearchTextInput.bind(this)} onKeyDown={e => {this.onEnterPress(e)}} className="sm-header-searchbar-ip" placeholder="Search products" />
                        {
                            this.state.searchword !== "" ? <span className="sm-header-close-btn" onClick={this.closeSearch.bind(this)}>&#10006;</span> : null
                        }
                            <div className="input-group-btn home_search_icon">
                                <button className="btn btn-default sm-header-search-icon-btn" onClick={this.handleSearchButton.bind(this)}>
                                    <i className="glyphicon glyphicon-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const LoggedHead = (username) => {
    return(
        <React.Fragment>
            <h4 className="sm-header-user-welcome">Hello,</h4>
            <h4 className="sm-header-user-welcome">{username.username}</h4>
        </React.Fragment>
    )
}
const LoggedMob = (l) => {
    return(
        <React.Fragment>
            <Link to={'/settings'}>Settings</Link>
            <a href="#" onClick={l.logout.bind(this)}>Logout</a>
        </React.Fragment>
    )
}

const NotLogged = () =>{
    return (
        <React.Fragment>
            <Link to={'/register'}><span className="glyphicon glyphicon-user"></span> Sign Up</Link>
            <Link to={'/login'}><span className="glyphicon glyphicon-log-in"></span> Login</Link>
        </React.Fragment>
        
    )
}

export default withRouter(HeaderSmall);