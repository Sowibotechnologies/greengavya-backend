import React from 'react';
import Cookies from 'js-cookie';

class Addressform extends React.Component{
    state = {
        fullnameerr:false,
        phoneerr:false,
        housenameerr:false,
        areaerr:false,
        cityerr:false,
        pinerr:false,
        fullnameregerr:false,
        arearegerr:false,
        cityregerr:false
    }

    handleNewaddress(e){
        e.preventDefault();
        var nameRegex = /^[a-zA-Z\s]+$/;
        var err;
        var data = e.target;
        var errorList = {
            fullnameerr:false,
            phoneerr:false,
            housenameerr:false,
            areaerr:false,
            cityerr:false,
            pinerr:false,
            fullnameregerr:false,
            arearegerr:false,
            cityregerr:false
        }
        //fullname:data.fullname.value,mobile:data.mobile.value,district:data.district.value,house:data.house.value,area:data.area.value,city:data.city.value,pin:data.pin.value,landmark:data.landmark.value
        if(data.fullname.value === "" || data.fullname.value.length < 3 || data.fullname.value.length > 25){
            errorList.fullnameerr = true
        }
        if(data.fullname.value !== "" ){
            if(!nameRegex.test(data.fullname.value)){
                errorList.fullnameregerr = true
            }
        }
        if(data.mobile.value === "" || data.mobile.value.length < 6 || data.mobile.value.length > 15){
            errorList.phoneerr = true;
        }
        if(data.house.value === "" || data.house.value.length < 3 || data.house.value.length > 75){
            errorList.housenameerr = true;
        }
        if(data.area.value === "" || data.area.value.length < 3 || data.area.value.length > 50){
            errorList.areaerr = true;
        }
        if(data.area.value !== "" ){
            if(!nameRegex.test(data.area.value)){
                errorList.arearegerr = true
            }
        }
        if(data.city.value === "" || data.city.value.length < 3 || data.city.value.length > 50){
            errorList.cityerr = true;
        }
        if(data.city.value !== "" ){
            if(!nameRegex.test(data.city.value)){
                errorList.cityregerr = true
            }
        }
        if(data.pin.value === "" || data.pin.value.length !== 6){
            errorList.pinerr = true;
        }

        this.setState({
            fullnameerr:errorList.fullnameerr,
            phoneerr:errorList.phoneerr,
            housenameerr:errorList.housenameerr,
            areaerr:errorList.areaerr,
            cityerr:errorList.cityerr,
            pinerr:errorList.pinerr,
            fullnameregerr:errorList.fullnameregerr,
            arearegerr:errorList.arearegerr,
            cityregerr:errorList.cityregerr,
        })
        var errorFree = false;
        for(err in errorList){
            if(errorList[err] === true){
                errorFree = true;
            }
        }
        if(!errorFree){
            this.props.onSubmitAddress(data.fullname.value,data.mobile.value,data.house.value,data.area.value,data.city.value,data.pin.value,data.district.value,data.landmark.value);
        }

    }

    render() {
        const {fullnameerr, phoneerr, housenameerr, areaerr, cityerr, pinerr,fullnameregerr,arearegerr,cityregerr} = this.state;
        return (
            <form onSubmit={this.handleNewaddress.bind(this)}>
                <p>Fullname *</p>
                <input type="text" name="fullname" ref="startaddress" id="fullname" className={fullnameerr || fullnameregerr ? 'address-textfield-err' :'address-textfield'}/>
                {
                    fullnameerr ? <p className="address-err-msg">Must have atleast 3-25 character!</p> : null
                }
                {
                    fullnameregerr ? <p className="address-err-msg">Enter a valid name</p> : null
                }
                <p>Mobile number *</p>
                <input type="number" name="mobile" id="mobile" className={phoneerr ? 'address-textfield-err' :'address-textfield'} />
                {
                    phoneerr ? <p className="address-err-msg">Must have atleast 6-15 character!</p> : null
                }
               
                <p>Flat/House/Building no *</p>
                <input type="text" name="house" id="house" className={housenameerr ? 'address-textfield-err' :'address-textfield'} />
                {
                    housenameerr ? <p className="address-err-msg">Must have atleast 3-75 character!</p> : null
                }
                <p>Area, Street *</p>
                <input type="text" name="area" id="area" className="address-textfield" className={areaerr || arearegerr ? 'address-textfield-err' :'address-textfield'} />
                {
                    areaerr ? <p className="address-err-msg">Must have atleast 3-50 character!</p> : null
                }
                {
                    arearegerr ? <p className="address-err-msg">Enter a valid area name</p> : null
                }
                <p>City, Town *</p>
                <input type="text" name="city" id="city" className={cityerr || cityregerr ? 'address-textfield-err' :'address-textfield'} />
                {
                    cityerr ? <p className="address-err-msg">Must have atleast 3-50 character!</p> : null
                }
                {
                    cityregerr ? <p className="address-err-msg">Enter a valid city name</p> : null
                }
                <p style={{marginTop:'10px'}}>District * &nbsp;<span style={{color:'red',float:'right'}}>* within city limits only</span></p>
                <select className="address-selectoption" name="district" >
                    <option>Trivandrum</option>
                </select>
                <p>Pin *</p>
                <input type="number" name="pin" id="pin" className={pinerr ? 'address-textfield-err' :'address-textfield'}/>
                {
                    pinerr ? <p className="address-err-msg">Enter a valid PIN number</p> : null
                }
                <p>Landmark(Optional)</p>
                <input type="text" name="landmark" id="landmark" className="address-textfield" minLength="3" maxLength="100"/>
                <p style={{color:'red'}}>* Required Fields</p>
                <input type="submit" className="address-btn" value="Deliver to this address"/>
            </form>
        )
    }
}

export default Addressform;