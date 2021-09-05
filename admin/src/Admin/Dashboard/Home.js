import React from 'react';
import './Home.css';
import * as d3 from "d3";
import {Link} from 'react-router-dom';

class Home extends React.Component{
    state={
        p_count: 0, p_end: 0,
        c_count: 0, c_end: 0,
        o_count: 0, o_end: 0,
        u_count: 0, u_end: 0,
        browser_data : "",
        path_data : "",
        source_data : "",
        city_data : ""
    }
    componentDidMount(){
        this.fetchCount();
        this.fetchAnalyticsByBrowser();
        this.fetchAnalyticsByPath();
        this.fetchAnalyticsBySource();
        this.fetchAnalyticsByCity();
    }
    drawChart() {
        const data = [];
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 360 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        // Testing
        


        const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("margin-left", 100);
        
        Object.keys(this.state.browser_data).map((item) => {
            data.push(this.state.browser_data[item][1]);
        });
        x.domain(d3.extent(data, function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.count; })]);
        svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d, i) => i * 70)
          .attr("y", (d, i) => height - 10 * d)
          .attr("width", 65)
          .attr("height", (d, i) => d * 10)
          .attr("fill", "green")

          svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => height - (10 * d) - 3)
          
      }
      drawLineGraph(){
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);


        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // Get the data
        fetch("/api/product/getall")
        .then(res => res.json())
        .then(result => {

        // // format the data
        // data.forEach(function(d) {
        // d.date = parseTime(d.date);
        // d.close = +d.close;
        // });
        // format the data
        var data = [];
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        Object.keys(result).map((item) => {
            data.push({
                "cost_price": result[item].cost_price,
                "price": result[item].price
            });
        });
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.cost_price; }));
        y.domain([0, d3.max(data, function(d) { return d.price; })]);
        var valueline = d3.line()
        .x(function(d) { return x(d.cost_price); })
        .y(function(d) { return y(d.price); });

        // Add the valueline path.
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
        .call(d3.axisLeft(y));

        }).catch((err) => console.log(err));
      }
    fetchCount(){
        fetch("/api/home/getcountall")
        .then(res => res.json())
        .then(result => {
            setInterval(()=>{
                this.tick(result[0].product_count,result[0].category_count,result[0].order_count,result[0].user_count);
             },20);
        }).catch((err) => console.log(err));
    }
    fetchAnalyticsByBrowser(){
        fetch("/api/home/getanalyticsbybrowser")
        .then(res => res.json())
        .then(result =>{
            this.setState({
                browser_data: result.data.rows
            })
        }).catch((err)=> console.log(err));
    }
    fetchAnalyticsByPath(){
        fetch("/api/home/getanalyticsbypath")
        .then(res => res.json())
        .then(result =>{
            this.setState({
                path_data: result.data.rows
            })
        }).catch((err)=> console.log(err));
    }
    fetchAnalyticsBySource(){
        fetch("/api/home/getanalyticsbysource")
        .then(res => res.json())
        .then(result =>{
            this.setState({
                source_data: result.data.rows
            })
        }).catch((err)=> console.log(err));
    }
    fetchAnalyticsByCity(){
        fetch("/api/home/getanalyticsbycity")
        .then(res => res.json())
        .then(result =>{
            this.setState({
                city_data: result.data.rows
            })
        }).catch((err)=> console.log(err));
    }
    tick(p_end,c_end,o_end,u_end){
        var {p_count,c_count,o_count,u_count} = this.state;
        if(p_count !== p_end){
            this.setState({
                p_count: p_count+1
            });
        } 
        if(c_count !== c_end){
            this.setState({
                c_count: c_count+1
            });
        } 
        if(o_count !== o_end){
            this.setState({
                o_count: o_count+1
            });
        } 
        if(u_count !== u_end){
            this.setState({
                u_count: u_count+1
            });
        } 
    }
    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        var hDisplay = h > 0 ? h + (h === 1 ? "h " : "h ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? "m " : "m ") : "";
        var sDisplay = s >= 0 ? s + (s === 1 ? "s" : "s") : "";
        return hDisplay + mDisplay + sDisplay; 
    }
    render(){
        return(
            <React.Fragment>
                <div className="row" style={{marginTop:'100px'}}>
                    <div>
                        <h1>Welcome Admin</h1>
                    </div>
                    <Link to="/Dashboard/allProducts">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div class="text-center card">
                                    <img alt="Product icon" className="img-responsive" style={{margin:'auto'}} src="/images/product.png"/>
                                    <h5 class="dash-counter-head">Products</h5>
                                    <h1 class="dash-counter-num">{this.state.p_count}</h1>
                            </div>
                        </div>
                    </Link>
                    <Link to="/Dashboard/allCategories">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div class="text-center card">
                                <img alt="Categories icon" className="img-responsive" style={{margin:'auto'}} src="/images/categories.png"/>
                                    <h5 class="dash-counter-head">Categories</h5>
                                    <h1 class="dash-counter-num">{this.state.c_count}</h1>
                            </div>
                        </div>
                    </Link>
                    <Link to="/Dashboard/purchaseDetail">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div class="text-center card">
                                    <img alt="Orders icon" className="img-responsive" style={{margin:'auto'}} src="/images/orders.png"/>
                                    <h5 class="dash-counter-head">Pending Orders</h5>
                                    <h1 class={this.state.o_count === 0 ? "dash-counter-num" : "dash-counter-alert-num"}>{this.state.o_count}</h1>
                            </div>
                        </div>
                    </Link>
                    <Link to="/Dashboard/user">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div class="text-center card">
                                    <img alt="Shopper icon" className="img-responsive" style={{margin:'auto'}} src="/images/shopper.png"/>     
                                    <h5 class="dash-counter-head">Shoppers</h5>
                                    <h1 class="dash-counter-num">{this.state.u_count}</h1>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="container" style={{marginTop:'40px'}}>
                    <h1 style={{color:'#616161'}}>Website Analytics</h1>
                </div>
                <div id="exTab1" className="card container" style={{marginBottom:'50px'}}>	
                <ul  className="nav nav-pills">
                            <li class="active">
                                <a className="home-tab"  href="#1a" data-toggle="tab">Browser Usage</a>
                            </li>
                            <li>
                                <a className="home-tab" href="#2a" data-toggle="tab">Sources</a>
                            </li>
                            <li>
                                <a className="home-tab" href="#3a" data-toggle="tab">Individual Page report</a>
                            </li>
                            <li>
                                <a className="home-tab" href="#4a" data-toggle="tab">Usage by location</a>
                            </li>
                </ul>
                <div className="table-responsive tab-content clearfix" style={{marginTop:'40px',minHeight:'300px',overflowX:'auto'}}>
                    <div className="tab-pane active" id="1a">
                        <table className="table">
                            <tbody>
                            <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                <th className="cissa-table-header">Browser</th>
                                <th className="cissa-table-header">Visitors</th>
                                <th className="cissa-table-header">Page view</th>
                                <th className="cissa-table-header">Entrance rate</th>
                                <th className="cissa-table-header">Exit Rate</th>
                            </tr>
                            {
                                Object.keys(this.state.browser_data).map((item) => {
                                    return(
                                        <BrowserRow data={this.state.browser_data[item]} context={this}/>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="tab-pane" id="2a">
                        <table className="table">
                            <tbody>
                            <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                <th className="cissa-table-header">Source</th>
                                <th className="cissa-table-header">Users</th>
                                <th className="cissa-table-header">Page view</th>
                                <th className="cissa-table-header">Time on page</th>
                                <th className="cissa-table-header">Avg time on page</th>
                            </tr>
                            {
                                Object.keys(this.state.source_data).map((item) => {
                                    return(
                                        <SourceRow data={this.state.source_data[item]} context={this}/>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        </div>
                        <div className="tab-pane" id="3a">
                            <table className="table">
                                <tbody>
                                <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                    <th className="cissa-table-header">Path</th>
                                    <th className="cissa-table-header">Visitors</th>
                                    <th className="cissa-table-header">Page view</th>
                                    <th className="cissa-table-header">Time on page</th>
                                    <th className="cissa-table-header">Avg time on page</th>
                                    <th className="cissa-table-header">Entrance rate</th>
                                    <th className="cissa-table-header">Exit Rate</th>
                                </tr>
                                {
                                    Object.keys(this.state.path_data).map((item) => {
                                        return(
                                            <PathRow data={this.state.path_data[item]} context={this}/>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    <div className="tab-pane" id="4a">
                        <table className="table">
                            <tbody>
                            <tr className="active showProduct-tableHead" style= {{color:"#000"}}>
                                <th className="cissa-table-header">City</th>
                                <th className="cissa-table-header">Visitors</th>
                                <th className="cissa-table-header">Page view</th>
                                <th className="cissa-table-header">Time on page</th>
                                <th className="cissa-table-header">Avg time on page</th>
                                <th className="cissa-table-header">Entrance rate</th>
                                <th className="cissa-table-header">Exit Rate</th>
                            </tr>
                            {
                                Object.keys(this.state.city_data).map((item) => {
                                    return(
                                        <CityRow data={this.state.city_data[item]} context={this}/>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </React.Fragment>

        )
    }
}
const BrowserRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td className="showProduct-tableBody-td">{props.data[0]}</td>
            <td className="showProduct-tableBody-td">{props.data[1]}</td>
            <td className="showProduct-tableBody-td">{props.data[2]}</td>
            <td className="showProduct-tableBody-td">{parseFloat(props.data[3]).toFixed(2)}</td>
            <td className="showProduct-tableBody-td">{parseFloat(props.data[4]).toFixed(2)}</td>
        </tr>
    )
}
const PathRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td className="showProduct-tableBody-td">{props.data[0]}</td>
            <td className="showProduct-tableBody-td">{props.data[1]}</td>
            <td className="showProduct-tableBody-td">{props.data[2]}</td>
            <td className="showProduct-tableBody-td">{props.context.secondsToHms(props.data[3])}</td>
            <td className="showProduct-tableBody-td">{props.context.secondsToHms(props.data[4])}</td>
            <td className="showProduct-tableBody-td">{parseFloat(props.data[5]).toFixed(2)}</td>
            <td className="showProduct-tableBody-td">{parseFloat(props.data[6]).toFixed(2)}</td>
        </tr>
    )
}
const SourceRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td className="showProduct-tableBody-td">{props.data[0]}</td>
            <td className="showProduct-tableBody-td">{props.data[1]}</td>
            <td className="showProduct-tableBody-td">{props.data[2]}</td>
            <td className="showProduct-tableBody-td">{props.context.secondsToHms(props.data[3])}</td>
            <td className="showProduct-tableBody-td">{props.context.secondsToHms(props.data[4])}</td>
        </tr>
    )
}
const CityRow = (props) =>{
    return(
        <tr className="showProduct-tableBody">
            <td className="showProduct-tableBody-td">{props.data[0]}</td>
            <td className="showProduct-tableBody-td">{props.data[1]}</td>
            <td className="showProduct-tableBody-td">{props.data[2]}</td>
            <td className="showProduct-tableBody-td">{props.context.secondsToHms(props.data[3])}</td>
            <td className="showProduct-tableBody-td">{props.context.secondsToHms(props.data[4])}</td>
            <td className="showProduct-tableBody-td">{parseFloat(props.data[5]).toFixed(2)}</td>
            <td className="showProduct-tableBody-td">{parseFloat(props.data[6]).toFixed(2)}</td>
        </tr>
    )
}
export default Home;