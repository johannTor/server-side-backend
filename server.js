const app = require('express')();
const cors = require('cors');
const url = require('url');
const path = require('path');
const qs = require('query-string');

const PORT = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient;
// Changed
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

app.use(cors()); // Use the cors middleware to allow the frontend to access the api with fetch calls

// Listen to a get request with the root as the path
app.get('/', (req, res) => {
  client.connect(async err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    const data = await collection.find().toArray();

    // Turn the data into a json string and send it to the client
    res.json(data);
  });
});
// Get the quotes from given tags? /space
app.get('/filter', (req, res) => {
  // Get the query string using the tags value
  const pars = req.query.tags;

  client.connect(async err => {
    if(pars === undefined) {
      res.status(400).json({msg: "Filter quotes with query string like so: filter?tags=tagname"});
    } else {
      const collection = client.db("test").collection("devices");
      // Split the parameters retrieved above into an array on ',' and search for the tags in db
      const data = await collection.find({tags: {$in: pars.split(',')}}).toArray();

      // Check if the data we recieve contains quotes, if not display message
      if(data.length > 0) {
        res.send(JSON.stringify(data));
      } else {
        res.status(400).json({msg: "No quotes with provided tags"});
      }
    }
  });
});

app.listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
})