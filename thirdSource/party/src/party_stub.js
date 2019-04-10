exports.lambda_handler = (event, context, callback) => {

    var responseBody =
        [  
            {  
                "firstName":"George",
                "lastName":"Washington",
                "partyID":2976554485
            },
            {  
                "firstName":"George",
                "lastName":"Washington",
                "partyID":3378421121
            },
            {  
                "firstName":"George",
                "lastName":"Washington",
                "partyID":3379535129
            },
            {  
                "firstName":"George",
                "lastName":"Washington",
                "partyID":2979372471
            }
        ];
        

    var response = {
        "statusCode": 200,
        "headers": {
            // This is ALSO required for CORS to work. When browsers issue cross origin requests, they make a 
            // preflight request (HTTP Options) which is responded automatically based on SAM configuration. 
            // But the actual HTTP request (GET/POST etc) also needs to contain the AllowOrigin header. 
            // 
            // NOTE: This value is *not* double quoted: ie. "'www.example.com'" is wrong
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
            "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
    callback(null, response);
};

