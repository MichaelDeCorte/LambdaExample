#!/bin/sh

BASENAME=$(basename $0 .sh)
OUTPUTFILE=$BASENAME.out

aws lambda invoke \
--profile mdecorte \
--invocation-type RequestResponse \
--function-name HelloWorld \
--region us-east-1 \
--log-type Tail \
--payload '{"key1":"value1", "key2":"value2", "key3":"value3"}' \
    $OUTPUTFILE |
sed 's@^[^[[:space:]]*[[:space:]]*@@'  | base64 --decode 

diff $OUTPUTFILE $BASENAME.base
if  [ "$?" -ne "0" ]
then
    mv $OUTPUTFILE $BASENAME.error
fi

