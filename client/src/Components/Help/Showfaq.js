import React from 'react';
import Header from '../Header/Header';
import HeaderSmall from '../Header/HeaderSmall';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';

class Showfaq extends React.Component{
    state = {
        questions:[],
        loading:false,
        selectedFaq:'',
        showerror:false
    }

    componentDidMount(){
        var params = this.props.match.params.type;
        setTimeout(() => {
            this.getFaq(params);
            this.setState({
                selectedFaq:params
            })
        }, 200);
        
    }

    getFaq(FAQtype){
        fetch('/api/faq/'+FAQtype)
        .then(res => res.json())
        .then(result => {
            setTimeout(() => {
                if(result.result.length === 0){
                    
                    this.setState({
                        loading:true,
                        showerror:true
                    })
                }else{
                    if(result.status !== 404){
                        this.setState({
                            questions:result.result,
                            loading:true
                        })
                    }else{
                        this.setState({
                            loading:true,
                            showerror:true
                        })
                    }
                }
            }, 200);
            
        })
    }
    render(){
        const { questions,loading, showerror, selectedFaq } = this.state;
        return(
            <React.Fragment>
                <div className="container-fluid">
                    <div className="c_respo_nav-large">
                        <Header/>
                    </div>
                    <div className="c_respo_nav-small">
                        <HeaderSmall/>
                    </div>
                    <Navigation />
                    <div className="container">
                        <div style={{marginTop:'20px'}}>
                            <Link to={'/faq'} >Back</Link>
                        </div>
                        <div className="row">
                            <h4 className="product-head">FAQs - <span style={{textTransform:'capitalize'}}>{selectedFaq}</span></h4>
                            {
                                loading ?
                                    showerror ? 
                                    <p>We are working on it. Try agian later.</p>
                                    :
                                    <div className="row">
                                        <div className="panel-group" id="accordionaccount">
                                            {
                                                questions.map((item, i) => {
                                                    return <Accordion faq={questions[i]} key={i}/>
                                                })
                                            }
                                        </div>
                                    </div>
                                :
                                <p>Loading</p>
                            }
                            
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

const Accordion = (props) => {
    var faq = props.faq;
    return(
        <div className="panel panel-default">
            <div className="panel-heading">
                <h4 className="panel-title faq-accordion-title">
                <a data-toggle="collapse" data-parent={"#accordion"+faq.subject} href={"#collapse" + faq.id}>{faq.question}</a>
                </h4>
            </div>
            <div id={"collapse"+faq.id} className="panel-collapse collapse">
                <div className="panel-body" dangerouslySetInnerHTML={{__html: faq.answer}}/>
            </div>
        </div>
    )
}

export default Showfaq;