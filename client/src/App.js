import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Introduction from "./components/introduction";
import WithFileLoading from "./components/download";
import { Container, Col, Row } from 'react-bootstrap/'
import "./App.css";

require("dotenv").config()

export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          name: '',
          email: '',
          linkedinURL: '',
          showMessage: false
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  _showMessage = (bool) => {
    this.setState({
      showMessage: bool
    });
  }

  handleChange(event) {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({[nam]: val});
  }

   
  handleSubmit(event) {
      event.preventDefault();
    //   alert('A form was submitted: ' + this.state.linkedinURL);
      // extract form data
      // const formData = new FormData(event.target.linkedinURL);
      // console.log(formData)
      let jsonString = this.state.linkedinURL;
      fetch(process.env.REACT_APP_API_ENDPOINT + "/requesttocreate", {
          crossDomain:true,
          mode:'no-cors',
          method: 'POST',
          headers: { 'Content-Type':'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin':'*'},
          body: jsonString
      })
  }

  

  render() {

      return (
          <div className='base-container'>
              <div className="container">
                    <Container fluid="md">
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <header>Linkedin Resume Builder</header>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <p>Use your Linkedin Profile to create a resume in 2 seconds. It's free.</p>
                        </Col>
                    </Row>         
                    </Container>
                    <div className="form-group">
                    <form onSubmit={this.handleSubmit}>
                          {/* <label>
                              Name:
                              <input type='text' value={this.state.name} name="name" onChange={this.handleChange}/>
                          </label>
                          <label>
                              Email:
                              <input type='text' value={this.state.email} name="email" onChange={this.handleChange}/>
                          </label> */}
                          <label className="text-center">
                              Linkedin URL:
                              <input type='text' value={this.state.linkedinURL} name="linkedinURL" onChange={this.handleChange} placeholder="Your Linkedin URL"/>
                          </label>
                              <button type='submit' value='Submit' className='btn text-center' onClick={this._showMessage.bind(null, true)}>Create Free Resume</button>
                              { this.state.showMessage && (<div><WithFileLoading dataFromParent = {this.state.linkedinURL}/></div>) }
                    </form>
                    </div>
                </div>
              <div className="body">
                  <Introduction />
              </div>

          </div>
          
      );
  }
}

