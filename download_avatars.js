var secret = require('./secrets');
var request = require('request');
var fs = require('fs');
var myArgs = process.argv.slice(2);

//cla error handling
if (myArgs.length === 0) {
  return console.error("You must enter the arguments... :(");  
}

console.log('Welcome to the GitHub Avatar Downloader!');

//function to authorize and get from github
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
  console.log("Errors:", err);
  var contributors = JSON.parse(result); 
  contributors.forEach(function(contributor){
    // cycles through JASON parsing and invoking
    var avatar_url = contributor.avatar_url;
    var filePath = "./avatars/" + contributor.login + ".jpg";
    downloadImageByURL(avatar_url, filePath);
  })  
});

function downloadImageByURL(url, filePath) {
  // downloads and writes images
  request.get(url)
      //throw error            
       .on('error', function (err) {                                   
         throw err; 
       })
      //response code and download start message
       .on('response', function (response) {                          
         onscole.log('Response Status Code: ', response.statusCode);
         console.log('Download starting...');
       })
       //download complete message
       .on('end', function () {
         console.log('...Download completed!')
       })
       .pipe(fs.createWriteStream(filePath));

}