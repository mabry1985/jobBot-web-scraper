# jobBot

jobBot is a webscraper, or rather a series of webscrapers, that I built to pull data from a number of job boards. My goal was to find a job first and foremost, but I thought it also would be fun to start collecting data about the job market for developers in the Portland Metro area. This data will be used to help build a personal dashboard. 

Still a work in progress.

## To-do

[ ] Add more test coverage
[ ] Add logic to watch individual company career pages
[ ] Add more job boards
[ ] Expand README

## Technologies/Libraries/Packages used
Node, Request, Puppeteer, Mongoose, Objects-to-CSV

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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)