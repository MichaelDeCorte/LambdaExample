#!/bin/sh

OUTPUTFILE=testOutput.txt
aws lambda invoke \
--profile mdecorte \
--invocation-type RequestResponse \
--function-name HelloWorld \
--region us-east-1 \
--log-type Tail \
--payload '{"key1":"value1", "key2":"value2", "key3":"value3"}' \
    $OUTPUTFILE | base64 --decode

echo ==== $OUTPUTFILE
cat $OUTPUTFILE
