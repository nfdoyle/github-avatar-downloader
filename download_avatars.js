var secret = require('./secrets');
var request = require('request');
var fs = require('fs');
var myArgs = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');

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
  console.log("Result:", result);
  var contributors = JSON.parse(result);
  console.log(contributors);
  
  contributors.forEach(function(contributor){
    var avatar_url = contributor.avatar_url;
    var filePath = "./avatars/" + contributor.login + ".jpg";
    downloadImageByURL(avatar_url, filePath);
  })
  
});

function downloadImageByURL(url, filePath) {
  // ...
  request.get(url)              
       .on('error', function (err) {                                   
         throw err; 
       })
       .on('response', function (response) {                          
         console.log('Response Status Code: ', response.statusCode);
         console.log('Download starting...');
       })
       .on('end', function () {
         console.log('...Download completed!')
       })
       .pipe(fs.createWriteStream(filePath));

}