import React from 'react';
import "./style.css";


class SubmitForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            linkedinURL: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

     
    handleSubmit(event) {
        event.preventDefault();
        alert('A form was submitted: ' + this.state.linkedinURL);
        // extract form data
        // const formData = new FormData(event.target.linkedinURL);
        // console.log(formData)
        let jsonString = this.state.linkedinURL;
        console.log(jsonString);
        fetch((process.env.REACT_APP_API_ENDPOINT + "/requesttocreate"), {
            crossDomain:true,
            mode:'no-cors',
            method: 'POST',
            headers: { 'Content-Type':'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin':'*'},
            body: jsonString
        })
        // .then((res) => {console.log(res.json())});
        // .then((json) => {console.log(json)});
    }

    render() {
        return (
            <div className='base-container'>
                <div className='header'>
                    <div className='content'>
                        <form action={process.env.REACT_APP_API_ENDPOINT + "/requesttocreate"} method="post" onSubmit={this.handleSubmit}>
                            <label>
                                Name:
                                <input type='text' value={this.state.name} name="name" onChange={this.handleChange}/>
                            </label>
                            <label>
                                Email:
                                <input type='text' value={this.state.email} name="email" onChange={this.handleChange}/>
                            </label>
                            <label>
                                Linkedin URL:
                                <input type='text' value={this.state.linkedinURL} name="linkedinURL" onChange={this.handleChange}/>
                            </label>
                                <button type='submit' value='Submit' className='btn'>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SubmitForm;