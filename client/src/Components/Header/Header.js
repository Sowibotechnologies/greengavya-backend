import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie';
import { withRouter } from 'react-router';

class Header extends React.Component{

    state = {
        authenticated:false,
        username:'',
        cartCount:0,
        searchword:'',
        searchFound:false,
        searchproducts:[],
        TotalSearchResult:[],
        showSearchResult:false,
        searchOnFocus:false
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
        if(this.props.searchMode === false){
            this.setState({
                searchword:''
            })
        }
    }

    handleSearchButton(){
        if(this.state.searchword !== ""){
            this.setState({
                showSearchResult:false
            })
            this.props.history.push({
                pathname: '/',
                search: '?search='+this.state.searchword,
                state: { detail: this.state.searchword}
            })
        }else{
            alert("Please enter a product.")
        }
        
    }
    setSearchWord(word){
        //console.log(word);
    
        this.props.history.push({
            pathname: '/',
            search: '?search='+word,
            state: { detail: word}
        })
        this.setState({
            searchFound:false,
            searchword:''
        })
    }
    setOnFocus(){
        //console.log("focus");
        if(this.state.searchproducts.length > 0 ){
            this.setState({
                showSearchResult:true
            })
        }
    }
    setOnBlur(){
        //console.log("blur");
        setTimeout(() => {
            // this.setState({
            //     showSearchResult:false
            // })
        }, 500);
        
    }
    
    onEnterPress(e){
        if(e.keyCode === 13){
            this.handleSearchButton();
        }
    }

    HandleSearchBar(e){
        const  { searchword, searchproducts, searchFound, TotalSearchResult } = this.state;
        let word = (e.target.value).trim();
        if(word === "" || word === null){
            //console.log("null value");
            
        }
        this.setState({
            searchword:word
        })
        setTimeout(() => {
            if(word.length === 1 && searchFound){
                this.setState({
                    searchproducts:TotalSearchResult
                })
            }else if(word.length === 1){
                //console.log(word.length);
                fetch('/api/product/search_n/'+ word)
                .then(res => {
                    if(res.status === 200){
                        return res.json();
                    }else{
                        //alert("no result found!!");
                        throw res;
                    }
                })
                .then(result => {
                    //console.log(result);
                    
                    if(result.length === 0){
                        this.setState({
                            searchFound:false
                        })
                    }else{
                    this.setState({
                            searchFound:true,
                            searchproducts:result,
                            TotalSearchResult:result,
                            showSearchResult:true
                        }) 
                    }
                })
                .catch(err => {
                    if(err.status == 404){
                        this.setState({
                            searchFound:false
                        })
                    }
                })
            }else if(word.length > 1){
                var _temparr = [];
                TotalSearchResult.forEach((item, i) => {
                    if(TotalSearchResult[i].name.toString().toLowerCase().indexOf(word.toLowerCase())!=-1){
                        //console.log(item);
                        _temparr.push(item)
                    }
                });
                this.setState({
                    searchproducts:_temparr
                })

            }else if(word.length === 0){
                this.setState({
                    searchFound:false,
                    searchproducts:[],
                    showSearchResult:false
                }) 
            }
        }, 100);
        
        
    }

    // handleSearchTextInput(e){
    //     const {totalsearchproducts,searchproducts,searchword, searchFound} = this.state;
    //     this.setState({
    //         searchword:e.target.value
    //     })
    //     console.log(searchword.length);
    //     setTimeout(() => {
    //         console.log(searchword.length);
            
    //         if(searchword.length === 0){
    //             fetch('/api/product/search_p/'+this.state.searchword)
    //             .then(res => {
    //                 if(res.status === 200){
    //                     return res.json();
    //                 }else{
    //                     //alert("no result found!!");
    //                     throw res;
    //                 }
    //             })
    //             .then(result => {
    //                 console.log(result);
                    
    //                 if(result.length === 0){
    //                     this.setState({
    //                         searchFound:false
    //                     })
    //                 }else{
    //                 this.setState({
    //                         searchFound:true,
    //                         searchproducts:result
    //                     }) 
    //                 }
    //             })
    //             .catch(err => {
    //                 if(err.status == 404){
    //                     this.setState({
    //                         searchFound:false
    //                     })
    //                 }
    //             })
    //         }else if(searchword.length > 0){
    //             searchproducts.forEach((item) => {
    //                 console.log(item);
                    
    //             })
    //         }
    //     }, 200);
        
        
    // }

    Logout(){
        Cookies.remove('_token', { path: '' });
        Cookies.remove('sessionID', { path: '' });
        window.location="/";
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
    closeNotFound(){
        this.setState({
            searchword:'',
            searchproducts:[],
            searchOnFocus:false,
            searchFound:false,
            showSearchResult:false
        })
    }
    closeSearch(){
        this.setState({
            searchword:''
        })
        window.location.href="/";
    }

    render(){
        return(
            <div className="container g-header">
                <div className="row nav-above">
                    <div className="col-lg-6 col-md-6 col-sm-6 text-left">
                        <Link to={'/'} className="home-head-link"><img onClick={() => { window.location = "/"; }} src={ window.location.origin + "/logo/ic_logo_horizontal.png"} height="80"/></Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <ul className="list-inline text-right home-side-ul" >
                                {
                                    this.state.authenticated ?
                                    <React.Fragment>
                                        <li style={{fontWeight:'normal'}}><span style={{textTransform:'capitalize'}}>{this.state.username}</span></li>
                                        <li><Link to={'/logout'} title="Logout"> Logout</Link></li>
                                        <li><Link to={'/settings'}>Settings</Link></li>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <li><Link to={'/login'} title="Login">Login</Link></li>
                                        <li><Link to={'/register'} title="Login">Register</Link></li>
                                    </React.Fragment>
                                }
                            <li style={{borderRight:'none'}}><Link to={'/contactus'} title="Contact Us">Contact Us</Link></li>
                        </ul>
                        <div className="input-group home_search_bar_div" style={{float:'right'}}>
                            <input type="text" aria-label="search" style={{paddingRight:'24px'}} onBlur={this.setOnBlur.bind(this)} onFocus={this.setOnFocus.bind(this)} value={this.state.searchword} autoComplete="off" onKeyDown={e => {this.onEnterPress(e)}} onChange={this.HandleSearchBar.bind(this)} className="form-control home_search_bar_input" placeholder="Search"  name="search"/>
                            {
                                this.state.searchword !== "" ? <span className="header-close-btn" onClick={this.closeSearch.bind(this)}>&#10006;</span> : null
                            }
                            
                            <div className="input-group-btn home_search_icon">
                                <button className="btn btn-default home_search_icon_btn" style={{borderLeft:'none'}} onClick={this.handleSearchButton.bind(this)}>
                                    <i className="glyphicon glyphicon-search"></i>
                                </button>
                            </div>
                            {
                                this.state.showSearchResult ?
                                    this.state.searchFound ?
                                    <div className="header-search-result-div">
                                        <ul className="header-search-result-ul">
                                            {
                                                this.state.searchproducts.length === 0 ?
                                                <li className="search-not-found">not found <span className="search-close-btn" onClick={this.closeNotFound.bind(this)}>&#10006;</span></li>
                                                :

                                                this.state.searchproducts.map((item, i) => {
                                                    return <li key={i} onClick={this.setSearchWord.bind(this,item.name)}><img src={item.img_url} width="46"/>&nbsp;{item.name}</li>
                                                })
                                            }
                                            {
                                                
                                            }
                                        </ul>
                                    </div>
                                    :
                                    null
                                :
                                null
                            }
                            
                        </div>
                        <div className="home-side-checkoutpanel">
                            <Link to={'/cart'}><i className="fa fa-shopping-cart home-side-checkoutpanel-cart" aria-hidden="true"></i>My Cart ({this.state.cartCount})</Link>
                            <Link className="btn-top-checkout btn" to={'/cart'}>Checkout  </Link>
                            <p style={{textAlign:'right',marginTop:'4px',letterSpacing:'1px'}}><img src={ window.location.origin + "/icons/call.png"} width="15" style={{marginTop:'-2px'}}/>&nbsp;+91 8870 345 698</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);