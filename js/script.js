'use strict';

/*
 *****************
 * Configuration *
 *****************
 */
// The AWS region in which to operate (eu-west-1, us-east-1, etc.).
var awsRegion = 'us-west-2';

// The ID of the Cognito Identity Pool that will be used to authenticate your
// requests to the AWS API.
var cognitoIdentityPoolId = 'us-west-2:07898c51-aa23-4ac6-9a65-faea93d3ad91';
/*
 ************************
 * End of Configuration *
 ************************
 */

AWS.config.region = awsRegion;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoIdentityPoolId,
});
let lambdaClient = new AWS.Lambda();

$("#wheel").css("display", "none");

function invokeLambda(funcName, payload) {
    let lambdaPromise = new Promise((resolve, reject) => {
        document.getElementById('send').style.display = "none"; 
        document.getElementById('wheel').style.display = "block";
        const eventPayload = {"prompt": payload}
        let params = {
            FunctionName: funcName,
            Payload: JSON.stringify(eventPayload)
        };
        //console.log(params.Payload);
        lambdaClient.invoke(params, (err, data) => {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(data);
                //console.log(data);
                document.getElementById('response').innerText =  JSON.parse(JSON.parse(data.Payload).body);
            }
            document.getElementById('send').style.display = "block";
            document.getElementById('wheel').style.display = "none";    
        });
    });
};

$("#prompt").keypress(function (e) {
    if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        invokeLambda('smith-level-1', document.getElementById('prompt').value)
    }
});