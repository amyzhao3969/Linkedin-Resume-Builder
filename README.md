# Linkedin Resume Builder

This is a full-stack javascript project which contains a React frontend and a Node backend. 

The Node and Express serve as an API, and it interacts with the React. 

* Front-End (client directory) is a single page application using React, React Bootstrap
* Back-End (server directory) includes Node.js, Express, API logic needed by the application

## Getting Started
#### Clone this project
```
cd ~/projects
git clone https://github.com/amyzhao3969/Linkedin-Resume-Builder.git
cd linkedin-resume-builder
```

for both the Frond-End and the Back-End run
```
npm install
```

Create a .env file in the root directory of server folder
Input your linkedin log in email, password and local host portal 
```
EMAIL=yourLinkedinEmailAddress
PW=yourLinkedinPassword
PORT=5000
```

Create a .env file in the root directory of the client folder
Input your API losthost endpoint
```
REACT_APP_API_ENDPOINT=http://localhost:5000
```




