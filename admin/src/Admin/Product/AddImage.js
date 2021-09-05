import React from 'react';

class AddImage extends React.Component{
    addImage(e){
        e.preventDefault();
        let form = new FormData(this.refs.myForm);
        form.append('myImage', e.target.file);
        form.append('product_id',"sadsdfsdf");
        fetch("/product/upload",{
            method:'POST',
            body:form
             }).then(res =>res.json())
             .then(result => {
             })
            .catch(e => console.log(e))
    }
    render(){
        return(
            <div className="text-left">
            <div class="modal-header text-center">
                    <h2 class="modal-title">Add Product</h2>
                </div>
                <div class="modal-body">
                    <form onSubmit={this.addImage.bind(this)} encType="multipart/form-data" ref="myForm" id="addproduct">
                        <div className="form-group">
                        <label for="pwd">img:</label>
                        </div>
                        <div className="form-group">
                        <input type="file" ref="file" className="form-control-file border" name="file" accept="image/*"/>
                        </div>
                        <div className="modal-footer addProduct-btnPanel">
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="reset" className="btn btn-danger" style={{float:"right"}}>Clear</button>
                        </div>
                    </form>
                </div>
           </div>
        );
    }
}
export default AddImage;