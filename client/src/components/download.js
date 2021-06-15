import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import { Button, Spinner } from 'react-bootstrap';

// import "./style.css";

export default class WithFileLoading extends React.Component {
    constructor(props) {
        super(props);
        let linkedinUrl = this.props.dataFromParent;
        console.log(linkedinUrl)
        let regex = /(?<=linkedin.com\/in\/)(.*)(?=\/)/;
        let user_id = linkedinUrl.match(regex)[0];

        this.state = {
            isLoading: true,
            error: null,
            user_id: user_id,
            intervalId: 0
        };
    }
    // _parseJSON: function(response) {
    //     return response.text().then(function(text) {
    //       return text ? JSON.parse(text) : {}
    //     })
    //   }
    componentDidMount() {
            function runInterval (user_id, state) { 
                let url = process.env.REACT_APP_API_ENDPOINT + `/output?user_id=` + user_id;
                console.log(url);
                var myFetch = {
                    // mode: "no-cors",
                    crossDomain: true,
                    method: "GET",
                    headers: {
                        "Accept": 'application/json',
                        "Content-Type": 'application.json'
                    }
                }
                fetch(url, myFetch)
                    .then(
                        response => 
                            response.json()
                        )
                    .then(
                        data => { 
                            state.setState({ isLoading: data.isLoading })
                            if (!data.isLoading) {
                                console.log("hi",data.isLoading); 
                                stopTimer(state)
                            }
                        })
                    .catch(
                        error => { console.log(error); state.setState({ isLoading: true }) })
            
            }

            function stopTimer(state) {
                console.log(state.state.intervalId)
                clearInterval(state.state.intervalId)
            }
        
        
        let intervalId = setInterval(function(a,b) {runInterval(a,b)}, 3000, this.state.user_id, this);
        this.setState({intervalId: intervalId})
    }
 
    render() {
        let url = process.env.REACT_APP_API_ENDPOINT + "/download?user_id=" + this.state.user_id
        console.log("hi")
        console.log(this.state.isLoading)
        return (
            this.state.isLoading
                ?   
                <>
                    <Button variant="primary" disabled>
                    <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                    <span className="sr-only">Loading...</span>
                    </Button>{' '}
                </>
                : <a download="resume.docx" href={url}>
                    <Button>Download</Button>{' '}
                    {/* <button type='button' className='btn'>Download</button> */}
                </a>
        )
    }
}