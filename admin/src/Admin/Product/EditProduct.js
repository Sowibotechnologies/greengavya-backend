import React from 'react'
import Cookies from 'js-cookie';
import Loader from '../Loader/Loader';
import Snackbar from '../Common/Snackbar';
import CircularLoader from '../Loader/CircularLoader';

class EditProduct extends React.Component{
    state={
        product : [],
        categories:"",
        food_types:"",
        categoryRow: [],
        food_typeRow:[],
        isFetching : true,
        isSubmitting : false,
        profit_percent : 0,
        category_name: "",
        local_img_url: "/images/no-image.png"
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
    componentDidMount() {
        this.loadCategories();
        setTimeout(()=>{ this.loadProductByID(this.props.match.params.id);},200);
    }
    updateImage(context){
        this.setState({isSubmitting:true});
        if(context.refs.category.value === ""){
            context.onResultChange({status:"Failed",message:"Category field cannot be empty"});
        }
        else if(context.refs.name.value === ""){
            context.onResultChange({status:"Failed",message:"Product name cannot be empty"});
        }
        else if(context.refs.price.value === ""){
            context.onResultChange({status:"Failed",message:"Price field cannot be empty"});
        }
        else if(context.refs.cost_price.value === ""){
            context.onResultChange({status:"Failed",message:"Cost Price field cannot be empty"});
        }
        else if(context.refs.quantity.value === ""){
            context.onResultChange({status:"Failed",message:"Quantity field cannot be empty"});
        }
        else if(parseFloat(context.refs.quantity.value) === 0){
            context.onResultChange({status:"Failed",message:"Quantity value cannot be less than zero"});
        }
        else if(parseFloat(context.refs.quantity.value) < 0){
            context.onResultChange({status:"Failed",message:"Quantity value cannot be less than zero"});
        }
        else if(parseFloat(context.refs.price.value) === 0){
            context.onResultChange({status:"Failed",message:"Price value cannot be less than zero"});
        }
        else if(parseFloat(context.refs.price.value) < 0){
            context.onResultChange({status:"Failed",message:"Price value cannot be less than zero"});
        }
        else if(parseFloat(context.refs.cost_price.value) < 0){
            context.onResultChange({status:"Failed",message:"Cost Price value cannot be less than zero"});
        }
        else{
            var category = "";
            const {categories} = context.state;
            Object.keys(categories).map((item) => {
                if(categories[item].name ===  context.refs.category.value){
                    category = categories[item].category_id;
                }
            })

            var quantity =  context.refs.quantity.value+" "+ context.refs.unit.value;
    
            let form = new FormData(context.refs.myForm);
            form.append('myImage', context.refs.file);
            form.append('product_id', context.props.match.params.id);
            form.append('old_img', context.state.product[0].img_url);
            var data= {
                product_id: context.props.match.params.id,
                name: context.refs.name.value,
                price: context.refs.price.value,
                cost_price: context.refs.cost_price.value,
                quantity:quantity,
                availability:"true",
                translated: context.refs.translated.value,
                category_id:category,
                img_url:context.state.product[0].img_url
            }
            if(context.refs.file.files.length !== 0){
                var token = Cookies.get("_token_admin");
                var session = Cookies.get("sessionID_admin");
                fetch("/api/product/updateimg",{
                    method:'POST',
                    headers:{
                        token: token,
                        sessionid: session
                    },
                    body:form
                     }).then(res =>res.json())
                     .then(result => {
                         data.img_url = result.path;
                         setTimeout(()=>{
                            context.updateProduct(data);
                        },500);
                     })
                    .catch(e => console.log(e))
    
            }
            else{
                context.updateProduct(data);
            }
        }
    }
    render(){
        return(
            <React.Fragment>
             { this.state.isFetching ? <div className="col-lg-10 addProduct-main"><Loader/></div>: this.contentRenderer() }
            </React.Fragment>
        );
    }
    contentRenderer(){
        var quantity = this.state.product[0].quantity.split(' ');
        return(
            <div class="container card" style={{marginTop:'20px'}}>
                  <div className="text-left" >
                  <div className="text-center">
                    <img alt="Product icon" className="card-head-img" src="/images/product.png"/>
                    <span className="card-head-title">Edit Products</span>
                  </div>
                  <form encType="multipart/form-data" ref="myForm" id="editproduct">
                    <div className="form-group">
                       <label for="pwd">Thumbnail:</label>
                    </div>
                    <div className="form-group">
                       <img alt="Product preview" src={this.state.local_img_url} width="100px" />
                       <input type="file" ref="file" className="form-control-file border" name="file" onChange={this.onImgChange.bind(this)} accept="image/*"/>
                    </div>
                    <div className="form-group">
                        <label for="usr">Name:</label>
                        <input type="text" className="form-control" maxLength="20" required ref="name" id="usr" placeholder="Name" defaultValue={this.state.product[0].name} />
                    </div>
                    <div className="form-group">
                        <label for="usr">Regional translation:</label>
                        <input type="text" className="form-control" maxLength="20" required ref="translated" id="usr" placeholder="Transaltion"defaultValue={this.state.product[0].translated} />
                    </div>
                    <div className="form-group">
                        <label for="usr">Category:</label>
                        <div>
                            <select className="purchaseDetails-select" ref="category"  placeholder="Category" defaultValue={this.state.product[0].category_name}>
                                {this.state.categoryRow}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="pwd">Cost Price:</label>
                        <input type="number" className="form-control" min="1" max="999999" required ref="cost_price" id="pwd" placeholder="Cost Price" defaultValue={this.state.product[0].cost_price} onChange={this.onCostPriceChange.bind(this)} onKeyPress={(e)=>{
                                if(e.target.value.length > 5) {
                                e.preventDefault();
                                }
                            }}/>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label for="pwd">Profit Percentage: {this.state.profit_percent}%</label>
                            <input type="range" min="0" max="100" step="0.1" class="percent_slider" value={this.state.profit_percent} onChange={this.onPercentChange.bind(this)}></input>
                        </div>
                        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label for="pwd">Selling Price:</label>
                            <input type="number" className="form-control" min="1" max="999999" required ref="price" id="pwd" placeholder="Price" defaultValue={this.state.product[0].price} onChange={this.onSellingPriceChange.bind(this)}  onKeyPress={(e)=>{
                                    if(e.target.value.length > 5) {
                                    e.preventDefault();
                                    }
                                }}/>
                        </div>
                    </div>
                    <label for="pwd">Quantity:</label>
                    <div className="form-inline">
                        <div className="form-group">
                                <input type="number" step= "0.25"  max="9999" className="form-control" required ref="quantity" id="pwd" placeholder="quantity" defaultValue={quantity[0]} onKeyPress={(e)=>{
                                if(e.target.value.length > 4) {
                                e.preventDefault();
                                }
                            }}/>
                                <select class="form-control" ref="unit" defaultValue= {quantity[1]}>
                                    <option>gm</option>
                                    <option>kg</option>
                                    <option>ml</option>
                                    <option>L</option>
                                    <option>nos</option>
                                    <option>pack</option>
                                </select>
                        </div>
                    </div>   
                    <div className="addProduct-btnPanel">
                        {
                            this.state.isSubmitting ? 
                            <CircularLoader />
                            : 
                            <button type="button" onClick={(e)=>{this.updateImage(this)}} className="btn btn-primary">Submit</button>
                        }
                    </div>
                  </form>
            </div>
            <Snackbar status={this.state.status} msg_state={this.state.msg_state} message={this.state.description}/>
         </div>
        )
    }
    loadProductByID(p_id){
        fetch("/api/product/getproductbyid/"+p_id)
        .then(res => res.json())
        .then(result => {
            var P_decimal = result[0].price / result[0].cost_price;
            var pp = (P_decimal - 1)*100; 
            pp = Math.round(pp * 100) / 100;
            this.setState({
                product: result,
                isFetching: false,
                profit_percent: pp
            });
            if(result[0].img_url !== '---'){
                this.setState({
                    local_img_url:result[0].img_url
                });
            }
        });
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
               msg_state:false,
               isSubmitting: false
           });
        }, 3000);
    }
    updateProduct(data){
        var token = Cookies.get("_token_admin");
        var session = Cookies.get("sessionID_admin");
        fetch("/api/product/"+data.product_id,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
                token: token,
                sessionid: session
            },
            body:JSON.stringify({
                product_id: data.product_id,
                name: data.name,
                price: data.price,
                cost_price: data.cost_price,
                quantity: data.quantity,
                availability: data.availability,
                translated: data.translated,
                category_id: data.category_id,
                img_url: data.img_url,
                date:  new Date().getTime()
            })
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
                setTimeout(()=>{this.props.history.push('/Dashboard/allProducts');},5000);
            }
        })
        .catch(e => console.log(e))

    }
}

export default EditProduct;