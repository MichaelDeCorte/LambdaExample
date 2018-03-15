#!/bin/sh

BASENAME=$(basename $0 .sh)
OUTPUT=$BASENAME.out
ERROR=$BASENAME.error
EXPECTED=$BASENAME.expected

aws lambda invoke \
--profile mdecorte \
--invocation-type RequestResponse \
--function-name HelloWorld \
--region us-east-1 \
--log-type Tail \
--payload '{"key1":"value1", "key2":"value2", "key3":"value3"}' \
    $OUTPUT |
sed 's@^[^[[:space:]]*[[:space:]]*@@'  | base64 --decode 

diff $OUTPUT $EXPECTED
if  [ "$?" -ne "0" ]
then
    mv $OUTPUT $ERROR
fi

