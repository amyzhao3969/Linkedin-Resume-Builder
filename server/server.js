import express from "express";
import axios from 'axios';
import scrapedin from 'scrapedin';
import * as fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { TemplateHandler } from 'easy-template-x';
import path, { dirname } from 'path';
const __dirname = path.resolve();
const PORT = process.env.PORT || 3001;
var router = express.Router();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

// need to use dotENV at the end
//process.env.MONGOLAB_URI;
const options = {
  email: process.env.EMAIL,
  password: process.env.PW
};

console.log(process.env.EMAIL)
console.log(process.env.PW)

app.get("/test", (req, res) => {
  res.send("Hi!");
});

app.post('/users', function (req, res) {
  let client_input = req.query.url;
  let regex = /^https:\/\/www.linkedin.com\/in\/.*\/$/;
  if (!client_input.match(regex)) {
    res.json({error: 'invalid url'});
  } else {
    res.json({
      status: "valid url"
    })
  }
});

app.post('/requesttocreate', async function (req, res) {
  console.log(req.body)
  console.log(Object.keys(req.body)[0]);
  let linkedinUrl = Object.keys(req.body)[0];
  let regex = /(?<=linkedin.com\/in\/)(.*)(?=\/)/;
  const user_id = linkedinUrl.match(regex)[0];
  const filePath = __dirname + `/temp/${user_id}.html`;
  console.log('request to create');
  console.log("linkedin", linkedinUrl);
  console.log("filePath", filePath);

  await scrapLinkedin(linkedinUrl).then(() => {createResume(filePath, user_id)})
  res.json({
    run: "Finished"
  })

  // res.set({
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  // });
  // res.json({reqBody: req.body})
  // res.statusCode(200);
});

//helper
app.post('/requestProfile', async function (req, res) {
  res.json({
    data: await scrapLinkedin(req.query.url)
  })
});

//helper
app.post('/createResume', async function (req, res) {
  res.json({
    file: await createResume(req.query.path)
  })
});

app.get('/download', async function (req, res) {
  let fileName = __dirname + `/output/myTemplate${req.query.user_id}.docx`;
  res.download(fileName);
});

//to check if the status of the file
app.get('/output', async function (req, res) {
  let user_id = req.query.user_id;
  console.log(user_id);
  let isLoading = !checkFileExist(user_id);
  console.log(isLoading);
  res.set({"Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",})
  res.json({
    isLoading: isLoading
  })
});

app.get('/user_Id', async function (req, res) {
  let user_id = await getID(req.query.linkedinUrl)
  res.json({
    user_id: user_id
  })
});

// 1. read template file
// const templateFile = fs.readFileSync('myTemplate.docx');

// const profileInfo = fs.readFileSync(req.query.path).toString();

const modifyData = async (data) => {
  let position = []
  let raw_position = data.positions
  for (let i=0; i< raw_position.length; i++) {
    if (raw_position[i].hasOwnProperty("roles")) {
      for (let j=0; j< raw_position[i]['roles'].length; j++) {
        raw_position[i]['roles'][j]['companyName'] = raw_position[i]['title']
        position.push(raw_position[i]['roles'][j])
      }
    } else {
      position.push(raw_position[i])
    }
  }
  raw_position = position
  return raw_position
}


const createResume = async (path, user_id) => {
  // let regex = /(?<=linkedin.com\/in\/)(.*)(?=\/)/;
  // console.log(linkedinUrl.match(regex)[0]);
  // const user_id = linkedinUrl.match(regex)[0];
  // const path = __dirname + `/temp/${user_id}.html`;
  const data = JSON.parse(fs.readFileSync(path));
  data.positions = await modifyData(data);
  const templateFile = fs.readFileSync(__dirname + `/temp/myTemplate.docx`);
  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, data);
  fs.writeFileSync(__dirname + `/output/myTemplate${user_id}.docx`, doc);
}

//return user_id from linkedUrl
const getID = async (linkedinUrl) => {
  let regex = /(?<=linkedin.com\/in\/)(.*)(?=\/)/;
  const user_id = linkedinUrl.match(regex)[0]
  return user_id
}

const doSomethingAsync = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve('I did something'), 3000)
  })
}

const scrapLinkedin = async (linkedinUrl) => { 
  // const linkedinUrl = `https://www.linkedin.com/in/${userid}/`;
  let regex = /(?<=linkedin.com\/in\/)(.*)(?=\/)/;
  const user_id = linkedinUrl.match(regex)[0];
  const filePath = __dirname + `/temp/${user_id}.html`;
  return new Promise(resolve => {
    fs.access(filePath, async (err) => {
      if (err) {
        console.log("The file does not exist.");
        await fetchData(linkedinUrl).then( profile => writeFile(filePath, profile));
        resolve("completed")
      } else {
        resolve("The file exists.")      
      }
    })
  })
};

// Wait for file to exist, checks every 5 seconds by default
function checkFileExist(user_id) {
      const filePath = __dirname + `/output/myTemplate${user_id}.docx`;
      const fileExists = fs.existsSync(filePath);

      console.log('Checking for: ', filePath);
      console.log('Exists: ', fileExists);

      if (fileExists) {
          return true;
      } else {
        return false;
      }
};


//write file function
async function writeFile (savPath, data) {
  return await new Promise(function (resolve, reject) {
    fs.writeFile(savPath, JSON.stringify(data, undefined, '\t'), function (err) {
      if (err) {
        reject(err)
      } else {
        resolve('resolving')
      }
    })
  })
};

//readfile function
function readFile (srcPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(srcPath, 'utf8', function (err, data) {
      if (err) {
        console.log("couldn't read file")
        reject(err)
      } else {
        resolve('resolving')
        console.log('data read here');
      }
    })
  })
};

const fetchData = async (url) => {
  try {
    console.log(`Fetching: ${url}`)
    const profileScraper = await scrapedin(options)
    const profile = await profileScraper(url)
    return profile
  } catch (e) {
    console.error(e);
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
}



// this wont work since linkedin blocks axios
const fetchHtml = async (url) => {
  // axios make the http request to get the url
  try {
    console.log(`Fetching: ${url}`)
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
      }
    });
    return data;
  } catch (e) {
    console.error(e);
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

//!! this doesnt work 
const checkFile = async (url) => {
  let regex = /(?<=linkedin.com\/in\/)(.*)(?=\/)/;
  const user_id = url.match(regex)[0]
  const filePath = __dirname + `/temp/${user_id}.html`;
  // Check if file exists in dir
  fs.access(filePath, async (err) => {
    if (err) {
      console.log("The file does not exist.");
      await fetchData(url).then( profile => writeFile(filePath, profile));
    } else {
      console.log("The file exists.")      
    }
  });
}


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});