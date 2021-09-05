import React from 'react';
import Cookies from 'js-cookie';
import './ShowCategory.css';
import Empty from '../Common/Empty';
import Snackbar from '../Common/Snackbar';
import Loader from '../Loader/Loader';

class ShowCategory extends React.Component{
    state = {
        categories: [],
        isFetching: true,
        currentPage: 1,
        itemsPerPage: 8,
        editID: "",
        deleteID: "",
        nameToggle:''
    }
    componentDidMount(){
        this.fetchCategories();
        this.render();
    }
    fetchCategories(){
        fetch("/api/category/getcategory")
        .then(res => res.json())
        .then(result => {
            this.setState({
                isFetching:false,
                categories: result,
                currentPage:1
            });
        }).catch((err) => console.log(err));
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
        setTimeout(()=>{this.fetchCategories();},200);
    }
    onEditChange(e){
        this.setState({
            editName:e.target.value
        });
    }
    addCategory()
    {
        var categoryForm = document.getElementById("addcategory");
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/category/send",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify(
                {
                    name: this.refs.new_name.value,
                    date: new Date().getTime()
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
            categoryForm.reset();
        })
        .catch(e => console.log(e))
    }
    editCategory(){
            var token = Cookies.get("_token_admin");
            var session = Cookies.get("sessionID_admin");
            
            fetch("/api/category/"+this.state.editID,{
                method:'PUT',
                body:JSON.stringify({category_name: this.refs.name.value}),
                headers:{
                  "Content-Type": "application/json",
                  token: token,
                  sessionid: session
                }
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
                if(result.status !== "Success"){
                    setTimeout(()=>{
                        this.fetchCategories();
                    },100);
                }
            })
            .catch(e => console.log(e));
    }
    deleteCategory(e){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
            fetch("/api/category/"+this.state.deleteID,{
              method:'DELETE',            
              headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
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
                if(result.status === "Success"){
                    setTimeout(()=>{
                        this.fetchCategories();
                        this.render()},200);
                }
            })
            .catch(e => console.log(e))
    }
    sortArrayByName(){
        var {categories} = this.state;
        switch(this.state.nameToggle){
            case '':{
                this.setState({
                    categories: categories.sort(function(a, b){
                        if(capitalize(a.name) < capitalize(b.name)) { return -1; }
                        if(capitalize(a.name) > capitalize(b.name)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down'
                });
                break;
            }
            case 'down':{
                this.setState({
                    categories: categories.sort(function(a, b){
                        if(capitalize(a.name) > capitalize(b.name)) { return -1; }
                        if(capitalize(a.name) < capitalize(b.name)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'up'
                });
                break;
            }
            case 'up':{
                this.setState({
                    categories: categories.sort(function(a, b){
                        if(capitalize(a.name) < capitalize(b.name)) { return -1; }
                        if(capitalize(a.name) > capitalize(b.name)) { return 1; }
                        return 0;
                    }),
                    nameToggle:'down'
                });
                break;
            }
        }
    }
    render(){
        const {categories,currentPage,itemsPerPage} = this.state;
        const lastIndex = currentPage*itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        var currentItemList = Object.entries(categories).slice(firstIndex,lastIndex);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(categories.length / itemsPerPage); i++) {
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
                    <div class="modal fade" id="myModal" role="dialog" style={{paddingLeft:'0px'}}>
                            <div class="modal-dialog modal-sm">
                                <div class="modal-content"> 
                                    <div class="modal-header text-center">
                                        <img src="/images/edit.png" alt="edit" width="50"/>
                                        <h2 class="modal-title">Add Category</h2>
                                    </div> 
                                    <div class="modal-body">
                                        <form class="row" id="addcategory" onSubmit={(e)=>{e.preventDefault();}}>
                                            <div className="text-left container-fluid">
                                                <input style={{marginTop:'20px'}} type="text" className="form-control" required ref="new_name" id="usr" placeholder="New category name"/>
                                                <button style={{marginTop:'20px'}} type="submit" data-dismiss="modal" onClick={(e)=>{this.addCategory(this)}} class="btn btn-primary"><span class="glyphicon glyphicon-tags"></span>  &nbsp;Add Category</button>                         
                                            </div>
                                        </form>
                                    </div>   
                                </div>
                            </div>
                    </div>
                    <div class="container card table-responsive" style={{marginTop:'20px',height:'90vh'}}>
                        <div className="text-center">
                            <img alt="Categories icon" className="card-head-img" src="/images/categories.png"/>
                            <span className="card-head-title">Categories</span>
                        </div>
                        <button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal" style={{marginTop:'10px',marginBottom:'20px',float:'left'}}>
                                <span style={{paddingRight:'15px'}} class="glyphicon glyphicon-tags"></span> Add Category 
                        </button>
                        {this.state.isFetching ? <Loader/>:(this.state.categories.length === 0 ? <Empty/>: 
                        (
                            <table className="table" style={{marginTop:'30px'}}>
                                    <tbody>
                                    <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                        <th className="cissa-table-header">Name&nbsp;&nbsp;<span style={{cursor:'pointer'}} className={this.state.nameToggle === ''? "glyphicon glyphicon-menu-down toggler" : (this.state.nameToggle === 'down' ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up")} onClick={this.sortArrayByName.bind(this)}></span></th>
                                        <th className="cissa-table-header">Action</th>
                                    </tr>
                                        { Object.keys(currentItemList).map((item) => {
                                            return(
                                                <CategoryRow data={currentItemList[item][1]} context={this} key={currentItemList[item][1].product_id}/>
                                            )
                                        })
                                    }
                                    </tbody>
                            </table>
                        ))
                        }
                    </div>
                    <div>
                        <ul class="page-numbers pagination">
                                {renderPageNumbers}
                        </ul>
                    </div>
                    <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
                    <div class="modal fade" id="categoryModal" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                            <div>
                                <div class="modal-header text-center">
                                    <img src="/images/edit.png" alt="edit" width="50"/>
                                    <h2 class="modal-title">Edit Category</h2>
                                </div>
                                <div class="modal-body">
                                    <form id="editcategory text-center" onSubmit={(e)=>{e.preventDefault();}}>
                                        <div style={{padding:'20px'}} className="form-group">
                                            <input type="text" style={{padding:'24px',fontSize:'21px'}} className="form-control" onChange={this.onEditChange.bind(this)} value={this.state.editName} required ref="name" id="usr" placeholder="New category name"/>
                                            <button style={{marginTop:'20px'}} onClick={(e)=>{this.editCategory(this)}} type="button"  data-dismiss="modal" class="modal-btn success">Save Changes</button>
                                        </div>
                                    </form>  
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="delete-modal modal fade" id="categoryModalDelete" role="dialog">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">
                            <div className="text-left">
                                <div class="text-center modal-body">
                                    <img alt="Remove icon" src="/images/remove.png" width='75'></img>
                                    <h1 style={{color:'#a9a2a2',fontWeight:'100'}}>Are you sure?</h1>
                                    <form id="deletecategory" style={{marginTop:'20px'}}>
                                        <i style={{color:'#a9a2a2',fontWeight:'100',fontSize:'16px'}}>You cannot revert this process !</i>
                                        <div class="row text-center" style={{marginTop:'20px'}}>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <button type="reset" className="modal-btn greyed" data-dismiss="modal">Cancel</button>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <button type="button" className="modal-btn danger" data-dismiss="modal" onClick={this.deleteCategory.bind(this)}>Delete</button>
                                            </div>
                                        </div>
                                    </form>  
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

            </React.Fragment>

        );
    }

    
}
const CategoryRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td style={{fontSize:'22px'}}>{props.data.name}</td>
            <td>
                <div className="row text-left">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div style={{float:'right'}}>
                                {/* <img src="/images/edit.png" className="showProduct-imgBtn"  data-toggle="modal" data-target="#categoryModal" onClick={()=>{
                                    props.context.setState({
                                        editID: props.data.category_id,
                                        editName: props.data.name
                                    })
                                }}
                                ></img>
                                <p>Edit</p> */}

                                <label class="switch cissa-tooltip" >
                                <img alt="Edit icon" src="/images/edit.png" className="showProduct-imgBtn" data-toggle="modal" data-target="#categoryModal" onClick={()=>{
                                    props.context.setState({
                                        editID: props.data.category_id,
                                        editName: props.data.name
                                    })
                                }}></img>
                                <span class="tooltiptext">Edit Category</span>
                                </label>
                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            {/* <img src="/images/delete.png" className="showProduct-imgBtn" data-toggle="modal" data-target="#categoryModalDelete"  onClick={()=>{
                                    props.context.setState({
                                        deleteID: props.data.category_id
                                    })
                            }}></img>
                            <p>Delete</p> */}
                            <label class="switch cissa-tooltip" >
                                <img alt="Remove icon" src="/images/bin.png" className="showProduct-imgBtn" data-toggle="modal" data-target="#categoryModalDelete"  onClick={()=>{
                                    props.context.setState({
                                        deleteID: props.data.category_id
                                    })
                            }}></img>
                                <span class="tooltiptext">Delete category</span>
                            </label>
                        </div>
                </div>
            </td>

        </tr>
    );
}
function capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
export default ShowCategory;

