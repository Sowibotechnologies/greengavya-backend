import React from 'react';
import Cookies from 'js-cookie';
import Empty from '../Common/Empty';
import Snackbar from '../Common/Snackbar';
import './ShowUser.css';
import Loader from '../Loader/Loader';

class ShowFeedbacks extends React.Component{
    state={
        isFetching: true,
        users:{},
        currentPage: 1,
        itemsPerPage: 7,
        nameToggle:'',
        emailToggle:'',
        orderToggle:''
    }
    componentDidMount(){
        this.fetchUsers();
    }
    onPageChange(event){
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
    }
    onResultChange(e){
        this.setState({
            status: e.status,
            description: e.message,
            msg_state: true
        });
        setTimeout(()=>{    
            this.setState({
               msg_state:false
           });
        }, 3000);
        setTimeout(()=>{this.fetchUsers();},200);
    }
    fetchUsers(){
        this.setState({
            isFetching: true,
            users:{}
        });
        fetch("/api/user/getallfeedback")
        .then(res => res.json())
        .then(result => {
            console.log('====================================');
            console.log(result);
            console.log('====================================');
            this.setState({
                isFetching:false,
                users: result
            });
        }).catch((err) => console.log(err));
    }
    blockUser(){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/user/block",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify(
                {
                    user_id: this.state.blockID
                }
            )
        })
        .then(res =>{
            if(res.status === 200){
                return res.json()
            }
            if(res.status === 404){
                alert("Unauthorized user: Token Invalid");
                this.Logout();
                this.props.history.push('/login');
            }
        })
        .then(result => {
            this.onResultChange(result);
        })
        .catch(e => console.log(e))
    }
    sortArrayByName(){
        var {users} = this.state;
        switch(this.state.nameToggle){
            case '':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.username) < capitalize(b.username)) { return -1; }
                        if(capitalize(a.username) > capitalize(b.username)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down',
                    emailToggle:'',
                    orderToggle:''
                });
                break;
            }
            case 'down':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.username) > capitalize(b.username)) { return -1; }
                        if(capitalize(a.username) < capitalize(b.username)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'up',
                    emailToggle:'',
                    orderToggle:''
                });
                break;
            }
            case 'up':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.username) < capitalize(b.username)) { return -1; }
                        if(capitalize(a.username) > capitalize(b.username)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down',
                    emailToggle:'',
                    orderToggle:''
                });
                break;
            }
        }
    }
    sortArrayByEmail(){
        var {users} = this.state;
        switch(this.state.emailToggle){
            case '':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.email) < capitalize(b.email)) { return -1; }
                        if(capitalize(a.email) > capitalize(b.email)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'',
                    emailToggle:'down',
                    orderToggle:''
                });
                break;
            }
            case 'down':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.email) > capitalize(b.email)) { return -1; }
                        if(capitalize(a.email) < capitalize(b.email)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'',
                    emailToggle:'up',
                    orderToggle:''
                });
                break;
            }
            case 'up':{
                this.setState({
                    users: users.sort(function(a, b){
                        if(capitalize(a.email) < capitalize(b.email)) { return -1; }
                        if(capitalize(a.email) > capitalize(b.email)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'',
                    emailToggle:'down',
                    orderToggle:''
                });
                break;
            }
        }
    }
    sortArrayByDate(){
        var {users} = this.state;
        switch(this.state.orderToggle){
            case '':{
                this.setState({
                    users: users.sort(function(a, b){
                        return(a.date - b.date)
                    }),
                    nameToggle:'',
                    emailToggle:'',
                    orderToggle:'down'
                });
                break;
            }
            case 'down':{
                this.setState({
                    users: users.sort(function(a, b){
                        return(b.date - a.date)
                    }),
                    nameToggle:'',
                    emailToggle:'',
                    orderToggle:'up'
                });
                break;
            }
            case 'up':{
                this.setState({
                    users: users.sort(function(a, b){
                        return(a.order_count - b.order_count)
                    }),
                    nameToggle:'',
                    emailToggle:'',
                    orderToggle:'down'
                });
                break;
            }
        }
    }

    render(){
        const {users,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Object.entries(users).slice(firstIndex,lastIndex);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(users.length / itemsPerPage); i++) {
          pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className={(this.state.currentPage === number ? 'active ' : '') + 'controls'}>
              <button className="pagination-button"
                key={number}
                id={number}
                onClick={this.onPageChange.bind(this)}>
                {number}
              </button>
              </li>
            );
          });
        return(
            <React.Fragment>
                <div class="container card table-responsive" style={{marginTop:'20px',height:'875px',position:'relative'}}>
                <div className="text-center">
                    <img alt="Shopper icon" className="card-head-img" src="/images/letter.png"/>
                    <span className="card-head-title">&nbsp;Feedbacks</span>
                </div>
                {this.state.isFetching ? <Loader/>: (this.state.users.length === 0 ? <Empty/>: 
                (<table className="table" style={{marginTop:'30px'}}>
                        <tbody>
                        <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                            <th className="cissa-table-header">Date&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.orderToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.orderToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByDate.bind(this)}></span></th>
                            <th className="cissa-table-header left-head">User&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.nameToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.nameToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByName.bind(this)}></span></th>
                            <th className="cissa-table-header left-head">Feedback&nbsp;&nbsp;</th>
                        </tr>
                        {
                            Object.keys(currentItemList).map((item) => {
                                return(
                                    <UserRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].user_id}/>
                                )
                            })
                        }
                        </tbody>
                </table>))
                }
                <p className="user-declaration"><span style={{color:'red'}}>*</span> Whitelisted shoppers only</p>
                </div>
                <div class="delete-modal modal fade" id="UserModalBlock" role="dialog">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                        <div className="text-left">
                            <div class="text-center modal-body">
                                <img alt="Block icon" src="/images/block.png" width='75'></img>
                                <h1 style={{color:'red',fontWeight:'100'}}>Are you sure?</h1>
                                <form id="deletecategory" style={{marginTop:'20px'}}>
                                    <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>This user will be blacklisted !</i>
                                    <div class="row text-center" style={{marginTop:'20px'}}>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <button type="button" className="modal-btn danger" data-dismiss="modal" onClick={this.blockUser.bind(this)}>Block</button>
                                        </div>
                                    </div>
                                </form>  
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div>
                    <ul class="page-numbers pagination">
                        {renderPageNumbers}
                    </ul>
                </div>
                <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
            </React.Fragment>            
        );
    }
}
const UserRow = (props) =>{
    var feedbackDate = new Date();
    feedbackDate.setTime(props.data.date);
    var formattedFeedbackDate = feedbackDate.toDateString();
    return(
        <tr className="showProduct-tableBody left-cell">
            <td style={{textAlign:'center',minWidth:'200px'}}>{formattedFeedbackDate}</td>
            <td style={{minWidth:'200px'}}>
                <span style={{textTransform:'capitalize'}}>{props.data.username}</span>
                <br></br>
                <span style={{fontSize:'8px'}}>{props.data.email}</span>
                <br></br>
                <span style={{fontSize:'8px'}}>
                    <a href={"tel:"+ props.data.phone}>{props.data.phone}</a>
                </span>
            </td>
            <td style={{minWidth:'200px',wordBreak:'break-word',fontSize:'13px'}}>{props.data.comment}</td>
        </tr>
    );
}

function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export default ShowFeedbacks;