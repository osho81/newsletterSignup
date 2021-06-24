

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); // you need to add dependency first. See tips.

const app = express(); //corresponde to an instance of express
app.use(express.static("public")); //to handle static files (local images, local stulesheets etc): https://expressjs.com/en/starter/static-files.html
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");  //rendering html-file to browser
});

client.setConfig({   //see https://mailchimp.com/developer/marketing/guides/quick-start/
  apiKey: "14887aa84788ef84e1503c557f76d935-us1",
  server: "us1",
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const subscribingUser = { //constructing a JavaScript object
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {   //response doesn't necessary include statuscode so better use try/catch
    try {
      const response = await client.lists.addListMember("2d34e4601b", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };

  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");     //redirects to root page (see failure.html button)
});

app.listen(process.env.PORT || 3000, function() {    //process.env.PORT is for heroku deployment, port 3000 is for local deployment
  console.log("Server is running on port 3000.");
});


//Mailchimp documentation/guide: https://mailchimp.com/developer/marketing/guides/create-your-first-audience/
//My mailchimp APIkey: 14887aa84788ef84e1503c557f76d935-us1
//my mailchimp server prefix (found in admin url and end of API key):. us1
//Mailchimp unique audcience ID (List ID): 2d34e4601b
