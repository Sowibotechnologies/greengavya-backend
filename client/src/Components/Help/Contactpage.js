import React from 'react';
import './contact.css';


class Contactpage extends React.Component{
    state ={
        selectedOption:'',
        captcha:''
    }
    

    handleHelp(e){
        this.setState({
            selectedOption:e.target.value
        })
        setTimeout(() => {
            if(this.state.selectedOption !== ""){
                //this.Captcha();
            }
        }, 500);
        
    }
    Submitorderhelp(e){
        e.preventDefault();
        var data = e.target.value;
        //console.log(data);
    }
    SubmitFeedback(e){
        e.preventDefault();
        var data = e.target;
        fetch("/api/contactus/feedback",{
            method:'POST',
            body : JSON.stringify({name:data.name.value,email:data.email.value,phone:data.phone.value,comment:data.comment.value}),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result.status === 200){
                alert("Successfully submited");
            }else{
                alert("Failed to submit. Please try again later!")
            }
            window.location = "/"
        })
        .catch(err => {
            console.log(err);
        })
    }
    Captcha(){
        var num1 = Math.floor(Math.random()*10);
        var num2 = Math.floor(Math.random()*10);
        var num3 = Math.floor(Math.random()*10);
        var i = Math.floor(Math.random()*26);
        var j = Math.floor(Math.random()*26);
        var ArrUc = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var ArrLc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

        var arrCombine = [num1, num2, num3, ArrLc[i], ArrUc[j]];

        var arrIndex2 = Math.floor(Math.random() * 4);
        var arrIndex1 = Math.floor(Math.random() * 4);
        var arrIndex3 = Math.floor(Math.random() * 4);
        var arrIndex4 = Math.floor(Math.random() * 4);
        var arrIndex5 = Math.floor(Math.random() * 4);

        var ch1=arrCombine[arrIndex1];
        var ch2=arrCombine[arrIndex2];
        var ch3=arrCombine[arrIndex3];
        var ch4=arrCombine[arrIndex4];
        var ch5=arrCombine[arrIndex5];

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.font = "30px monospace";
        //redraw
        ctx.clearRect(0,0,canvas.width,canvas.height);

        //print text
        ctx.fillText(ch1, 9,20);
        ctx.fillText(ch2, 24,26);
        ctx.fillText(ch3, 36,20);
        ctx.fillText(ch4, 50,22);
        ctx.fillText(ch5, 65,24);

        //draw two line
        ctx.moveTo(10,15);
        ctx.lineTo(90,10);
        ctx.moveTo(20,5);
        ctx.lineTo(90,20);
        ctx.stroke();

        var captchaStr = ch1 + "" + ch2 + "" + ch3 + "" + ch4 + "" + ch5;
        //console.log(captchaStr);
        this.setState({
            captcha:captchaStr
        })
    }

    render(){
        const {selectedOption } = this.state;
        let component = null;
        switch(selectedOption){
            case 'onlineorder' :
                component = <OnlineOrder reCaptcha={this.Captcha.bind(this)} Submitorderhelp={this.Submitorderhelp.bind(this)}/>
                break;
            case 'enquiry' :
                component = <Enquiry reCaptcha={this.Captcha.bind(this)} SubmitFeedback={this.SubmitFeedback.bind(this)} />
                break;
            default:
                component = null
                break;
        }
        return(
            <React.Fragment>
                <h3 className="contact-head">Contact Us</h3>
                <p>Got a question? We'd love to hear from you. Contact us via</p>
                <p>&nbsp;</p>
                {/* <p><img src={window.location.origin + "/icons/ic_location.png"}/>&nbsp;&nbsp;Store address</p> */}
                <p><img src={window.location.origin + "/icons/ic_call.png"}/>&nbsp;&nbsp;+91 8870 345 698</p>
                <p><img src={window.location.origin + "/icons/ic_mail.png"}/>&nbsp;&nbsp; help@greengavya.com</p>
                <p>&nbsp;</p>
                <p>To better assist you with your enquiry, please select one of the following options below. We look forward to hearing from you! </p>
                <p>- Greengavya</p>
                <div style={{marginTop:'50px'}}>
                    <select onChange={this.handleHelp.bind(this)}>
                        <option value="">-- Please select</option>
                        {/* <option value="onlineorder">Online order</option> */}
                        <option value="enquiry">Other Enquiries & Feedback</option>
                    </select>
                </div>
                {
                    component
                }
            </React.Fragment>
        )
    }
}

const OnlineOrder = (props) => {
    return(
        <div>
            <form onSubmit={props.Submitorderhelp.bind(this)}>
                <p className="reg-label">Name: *</p>
                <input type="text" name="name" id="name" maxLength="50" required className="login-textfield"/>
                <p className="reg-label">Email: *</p>
                <input type="email" name="email" id="email" maxLength="50" required className="login-textfield"/>
                <p className="reg-label">Phone: *</p>
                <input type="number" name="phone" id="phone" maxLength="50" required className="login-textfield"/>
                <p className="reg-label">Mention orderid: *</p>
                <input type="number" name="orderid" id="orderid" maxLength="50" required className="login-textfield"/>
                <p className="reg-label">Comment: *</p>
                <textarea rows="6" className="login-textfield" name="comment" id="comment"></textarea>
                <p className="reg-label">Enter captcha: *</p>
                <div>
                    <canvas id="canvas" width={100} height={40} maxLength="150" className="help-canvas"/>
                    <img src="./icons/ic_reload_captcha.png" className="help-captcha-reload" title={'Reload'} onClick={props.reCaptcha.bind(this)}/>
                </div>
                <input type="text" name="captcha" id="captcha" maxLength="10" required className="login-textfield"/>
                <button style={{marginTop:'14px'}} className="login-btn" type="submit">Submit</button>
            </form>
        </div>
    )
}

const Enquiry = (props) => {
    return(
        <div>
            <form onSubmit={props.SubmitFeedback.bind(this)}>
                <p className="reg-label">Name: *</p>
                <input type="text" name="name" id="name" maxLength="30" required className="login-textfield"/>
                <p className="reg-label">Email: *</p>
                <input type="email" name="email" id="email" maxLength="50" required className="login-textfield"/>
                <p className="reg-label">Phone: *</p>
                <input type="number" name="phone" id="phone" maxLength="20" required className="login-textfield"/>
                <p className="reg-label">Comment: *</p>
                <textarea rows="6" className="login-textfield" minLength="10" maxLength="150" name="comment" id="comment" required></textarea>
                {/* <p className="reg-label">Enter captcha: *</p> */}
                {/* <div>
                    <canvas id="canvas" width={100} height={40} maxLength="150" className="help-canvas"/>
                    <img src="./icons/ic_reload_captcha.png" className="help-captcha-reload" title={'Reload'} onClick={props.reCaptcha.bind(this)}/>
                </div> */}
                {/* <input type="text" name="captcha" id="captcha" maxLength="10" required className="login-textfield"/> */}
                <button style={{marginTop:'14px'}} className="login-btn" type="submit">Submit</button>
            </form>
        </div>
    )
}


export default Contactpage;