

var https = require('https');
var request = require("request");






function getmydata(){
    request.get('https://asucampaignprogress.asufoundation.org/Content/data/data.json',{
        'auth' : {
            'user' : "CampaignProgessBarApiDev\\$CampaignProgessBarApiDev",
            'pass' : "DBe7ZKZqXzkrlS4S7gKoFa1H8xbg5Wr5rPqHlChohnWLCnRSJwnsjKWFCEgC",
        }
    },
    function(err, response, body){
        console.log(JSON.parse(body));
    });
};
getmydata();


function httpsGet(myData, callback){
    var dataUrl = "https://asucampaignprogress.asufoundation.org/Content/data/data.json";
    var options = {
        host : "asucampaignprogress.asufoundation.org",
        port : 443,
        path : "/Content/data/data.json",
        method : "GET"
    }
    console.log("making request");
    var req = https.request(options, res => {

                var returnData = "";
                res.on('data', chunk => {
                    returnData = returnData + chunk;
                    console.log("chunking data");
                });
                res.on('end', () =>{
                        console.log("finished request");
                     finalData = JSON.parse(returnData);
                     callback(finalData);
                });
            });
}

