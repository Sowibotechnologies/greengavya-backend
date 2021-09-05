import React from 'react';
import Cookies from 'js-cookie';
import './AddProduct.css';
class AddProduct extends React.Component{
    state={
        categories:"",
        food_types:"",
        categoryRow: [],
        food_typeRow:[],
        profit_percent: 0,
        local_img_url: "/images/no-image.png"
    }
    componentDidMount() {
        this.loadCategories();
        this.render();
    }
    Logout(){
        Cookies.remove('_token_admin', { path: '' });
        Cookies.remove('sessionID_admin', { path: '' });
    }
    onImgChange(e){
        this.setState({
            local_img_url: e.target.files[0]
        });
        var reader = new FileReader();
        reader.onload = (event)=> {
            this.setState({
                local_img_url: event.target.result
            });
          };
          reader.readAsDataURL(e.target.files[0]);
    }
    clearProductForm(e){
        var productForm = document.getElementById('addproduct');
        productForm.reset();
        this.setState({
            local_img_url: "/images/no-image.png"
        });
    }
    onPercentChange(e){
        this.setState({profit_percent: e.target.value});
        var cp = this.refs.cost_price.value;
        var P_decimal = 1 + (e.target.value / 100); 
        var sp = P_decimal * cp; 
        sp = Math.round(sp * 100) / 100;
        this.refs.price.value = sp;
    }
    onCostPriceChange(e){
        var cp = e.target.value;
        var P_decimal = 1 + (this.state.profit_percent / 100); 
        var sp = P_decimal * cp; 
        sp = Math.round(sp * 100) / 100;
        this.refs.price.value = sp;
    }
    onSellingPriceChange(e){
        var sp = e.target.value;
        var cp = this.refs.cost_price.value;
        var P_decimal = sp / cp;
        var pp = (P_decimal - 1)*100; 
        pp = Math.round(pp * 100) / 100;
        this.setState({profit_percent: pp});
    }
    addProduct(data)
    {
        var productForm = document.getElementById("addproduct");
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/product/send",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify(
                {
                    product_id: data.product_id,
                    name: data.name,
                    price: data.price,
                    cost_price: data.cost_price,
                    quantity: data.quantity,
                    unit: data.unit,
                    availability: data.availability,
                    translated: data.translated,
                    category_id: data.category_id,
                    img_url: data.img_url,
                    date:  new Date().getTime()
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
                this.props.isAuthorized(false);
            }
        })
        .then(result => {
            this.props.result(result);
            if(result.status === "Success"){
                setTimeout(()=>{this.props.context.fetchProducts();},200);
            }
            productForm.reset();
        })
        .catch(e => console.log(e))
        this.setState({
            local_img_url: "/images/no-image.png"
        });
    }
    uploadImage(context){
        if(this.refs.category.value === ""){
            this.props.result({status:"Failed",message:"Category field cannot be empty"});
        }
        else if(this.refs.name.value === ""){
            this.props.result({status:"Failed",message:"Product name cannot be empty"});
        }
        else if(this.refs.price.value === ""){
            this.props.result({status:"Failed",message:"Price field cannot be empty"});
        }
        else if(this.refs.cost_price.value === ""){
            this.props.result({status:"Failed",message:"Price field cannot be empty"});
        }
        else if(this.refs.quantity.value === ""){
            this.props.result({status:"Failed",message:"Quantity field cannot be empty"});
        }
        else if(parseFloat(this.refs.quantity.value) === 0){
            this.props.result({status:"Failed",message:"Quantity value cannot be less than zero"});
        }
        else if(parseFloat(this.refs.quantity.value) < 0){
            this.props.result({status:"Failed",message:"Quantity value cannot be less than zero"});
        }
        else if(parseFloat(this.refs.price.value) === 0){
            this.props.result({status:"Failed",message:"Price value cannot be less than zero"});
        }
        else if(parseFloat(this.refs.price.value) < 0){
            this.props.result({status:"Failed",message:"Price value cannot be less than zero"});
        }
        else if(parseFloat(this.refs.cost_price.value) < 0){
            this.props.result({status:"Failed",message:"Price value cannot be less than zero"});
        }
        else{
            var category = "";
            var food_type = "";
            const {categories,food_types} = this.state;
            Object.keys(categories).map((item) => {
                if(categories[item].name ===  this.refs.category.value){
                    category = categories[item].category_id;
                }
            })
            Object.keys(food_types).map((item) => {
                if(food_types[item].name ===  this.refs.food_type.value){
                    food_type = food_types[item].type_id;
                }
            })
            console.log('====================================');
            console.log(category);
            console.log(food_type);
            console.log('====================================');
            let form = new FormData(this.refs.myForm);
            form.append('myImage', this.refs.file);
            var data= {
                product_id: "",
                name: this.refs.name.value,
                price: this.refs.price.value,
                cost_price: this.refs.cost_price.value,
                quantity:this.refs.quantity.value,
                unit: this.refs.unit.value,
                availability:"true",
                translated: this.refs.translated.value,
                category_id:category,
                img_url:"---"

            }
            if(this.refs.file.files.length !== 0){
                var token = Cookies.get("_token_admin");
                var session = Cookies.get("sessionID_admin");
                fetch("/api/product/upload",{
                    method:'POST',
                    headers:{
                        token: token,
                        sessionid: session
                    },
                    body:form
                     }).then(res =>res.json())
                     .then(result => {
                         data.product_id = result.product_id;
                         data.img_url = result.path;
                         setTimeout(()=>{
                            context.addProduct(data)
                        },500);
                     })
                    .catch(e => console.log(e))
    
            }
            else{
                context.addProduct(data);
            }
        }

    }
    onNameChange(e){
        e.preventDefault();
    }
    loadCategories(){
        fetch("/api/category/getcategory")
        .then(res => res.json())
        .then(result => {
            var temp = [];
            Object.keys(result).map((item) => {
                temp.push(
                    <option key={result[item].category_id}>{result[item].name}</option>
                );
            })
            this.setState({
                categoryRow: temp,
                categories: result
            });
        });
    }

    render(){
        return(
       <React.Fragment>
           <div className="text-left">
            <div class="modal-header text-center">
                    <h2 class="modal-title">Add Product</h2>
                </div>
                <div class="modal-body">
                    <form encType="multipart/form-data" ref="myForm" id="addproduct">
                        <div className="text-center form-group">
                            <label>
                                <input type="file" ref="file" id='imgupload' style={{display:'none'}} onChange={this.onImgChange.bind(this)} className="form-control-file border" name="file" accept="image/*"/>
                                <img className="heart-beat" alt="Product preview" style={{cursor:'pointer'}} src={this.state.local_img_url} width='100' height='100'></img>
                                {this.state.local_img_url === "/images/no-image.png" ? <p style={{fontWeight:'600'}}> No image selected</p>:""}
                            </label>
                        </div>
                        <div className="form-group">
                            <label for="usr">Name:</label>
                            <input type="text" style={{textTransform:'capitalize'}} className="form-control" maxLength="20" onChange={this.onNameChange.bind(this)} required ref="name" id="usr" placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <label for="usr">Regional translation:</label>
                            <input type="text" className="form-control" maxLength="20" required ref="translated" id="usr" placeholder="Transaltion"/>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <label for="usr">Category:</label>
                                <div>
                                    <select className="purchaseDetails-select" ref="category"  placeholder="Category" required>
                                        {this.state.categoryRow}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="pwd">Cost Price:</label>
                            <input type="number" className="form-control" min="1" max="999999" required ref="cost_price" id="pwd" placeholder="Cost Price" onChange={this.onCostPriceChange.bind(this)} onKeyPress={(e)=>{
                                if(e.target.value.length > 5) {
                                e.preventDefault();
                                }
                            }}/>
                        </div>
                        <div className="form-group">
                            <label for="pwd">Profit Percentage: {this.state.profit_percent}%</label>
                            <input type="range" min="0" max="100" step="0.1" class="percent_slider" value={this.state.profit_percent} onChange={this.onPercentChange.bind(this)}></input>
                        </div>
                        <div className="form-group">
                            <label for="pwd">Selling Price:</label>
                            <input type="number" className="form-control" min="1" max="999999" required ref="price" id="pwd" placeholder="Selling Price" onChange={this.onSellingPriceChange.bind(this)}  onKeyPress={(e)=>{
                                    if(e.target.value.length > 5) {
                                    e.preventDefault();
                                    }
                                }}/>
                        </div>
                        <label for="pwd">Quantity:</label>
                        <div className="form-inline">
                            <div className="form-group">
                                    <input type="number" min="0" step= "0.25" max="9999" className="form-control" required ref="quantity" id="pwd" placeholder="quantity" onKeyPress={(e)=>{
                                if(e.target.value.length > 4) {
                                e.preventDefault();
                                }
                            }}/>
                                    <select class="form-control" ref="unit">
                                        <option>gm</option>
                                        <option>kg</option>
                                        <option>ml</option>
                                        <option>L</option>
                                        <option>nos</option>
                                        <option>pack</option>
                                    </select>
                            </div>
                        </div>   
                        <div className="modal-footer addProduct-btnPanel">
                            <div class="row text-center">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <button type="button" className="modal-btn success" onClick={(e)=>{this.uploadImage(this)}} data-dismiss="modal">Submit</button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <button type="reset" className="modal-btn danger" data-dismiss="modal" onClick={this.clearProductForm.bind(this)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
           </div>

       </React.Fragment>
        );
    }
}
export default AddProduct;
