# jobBot

jobBot is a webscraper, or rather a series of webscrapers, that I built to pull data from a number of job boards. My goal was to find a job first and foremost, but I thought it also would be fun to start collecting data about the job market for developers in the Portland Metro area. This data is used to populate a personal [dashboard](https://github.com/mabry1985/jobBot-dashboard). 

## Technologies/Libraries/Packages used
Node, Request, Puppeteer, Mongoose, MongoDB Atlas

## Installation

Clone the repo 

Navigate to root directory

Install dependencies with 
```bash
npm i 
```
Copy .env file

```bash
cp sample.env .env 
```
Setup a cluster on Mongodb and add your connection to the .env file. 

```node
MONGO_CONNECTION=mongodb+srv://mabry1985:<password>@cluster0-8c5ga.mongodb.net/test?retryWrites=true&w=majority
```

## Usage
From root folder 

```bash
$ node index.js
```

## Known Issues

The scrapers that use puppeteer don't work in headless mode, I've tried multiple solutions I've found in forums but nothing works yet. I have feeling that it has something to do with the sheer amount of requests that jobbot is sending at a time. 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)