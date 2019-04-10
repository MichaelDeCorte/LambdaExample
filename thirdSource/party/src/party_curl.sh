#!/bin/sh

URL='https://4efiozl3v4.execute-api.us-east-1.amazonaws.com/dev/Employee'

if false
then
    echo
    echo 'get ============================================================'
    curl -X GET "$URL" \
         -H "Origin: https://yoursitedomain" \
         -H "Access-Control-Request-Method: GET" \
         -H "Content-Type: application/json" \
         -v 
fi


if false
then
    echo
    echo '============================================================'
    echo '============================================================'
    echo 'options============================================================'

    curl -X OPTIONS "$URL" \
         'https://4efiozl3v4.execute-api.us-east-1.amazonaws.com/Dev/Employee' \
         -H "Origin: https://yoursitedomain" \
         -H "Access-Control-Request-Method: POST" \
         -H "Access-Control-Request-Headers: authorization,content-type" \
         -v 

fi

if false
then
    echo
    echo '============================================================'
    echo '============================================================'
    echo 'post ============================================================'
    curl -X POST "$URL" \
         -H "Origin: https://yoursitedomain" \
         -H "Access-Control-Request-Method: POST" \
         -H "accept: application/json" \
         -H "Content-Type: application/json" \
         -v
fi


if true
then
    echo
    echo '============================================================'
    echo '============================================================'
    echo 'post ============================================================'
    curl -X POST "https://dh9qp202xf.execute-api.us-east-1.amazonaws.com/dev-stage/party" \
         -H "Origin: https://yoursitedomain" \
         -H "Accept: application/json" \
         -H "Accept-Encloding: gzip,deflate" \
         -H "Access-Control-Request-Method: POST" \
         -H "Content-Type: application/json" \
         -H "Authorization: eyJraWQiOiJZbzVWQVRyVEU1am1qSmlOQUNPQlJ2VkZCaXV4ZEdvUTZPUkZqb0pya21ZPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiYjJkWmpzcFloMDZjd1RSdFEyRlhwZyIsInN1YiI6ImRlNGFmYzFmLTg0YmQtNGU2OC05MzlhLWNhMTc2Yjk4ZDlhZCIsImF1ZCI6IjdpdDVucGhzdG4wM3I2N2Zha2x2ZGpzZDMzIiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX0pRcFV3ZGZsUl9Mb2dpbldpdGhBbWF6b24iXSwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiYW16bjEuYWNjb3VudC5BRlg3T1ZHRUdQUkxLUU4zT0pCWEtTTkVTN0hBIiwicHJvdmlkZXJOYW1lIjoiTG9naW5XaXRoQW1hem9uIiwicHJvdmlkZXJUeXBlIjoiTG9naW5XaXRoQW1hem9uIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTU1NDkwNzkzNTU5MyJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTQ5MTM2NzAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0pRcFV3ZGZsUiIsImNvZ25pdG86dXNlcm5hbWUiOiJMb2dpbldpdGhBbWF6b25fYW16bjEuYWNjb3VudC5BRlg3T1ZHRUdQUkxLUU4zT0pCWEtTTkVTN0hBIiwiZXhwIjoxNTU0OTE3MjcwLCJpYXQiOjE1NTQ5MTM2NzAsImVtYWlsIjoibWRlY29ydGUuZGVjb3J0ZSthbWF6b25AZ21haWwuY29tIn0.2dYP-qiLfK-Z2Jn_UDJUlM8Y1FaHBigMxqbBuMHSIE6KJgO7mghX8k-gp0_m0OJ7hGzjCUzhsd025MluZW71lLJmK6N9KK344o1tnyQB9vc6gliD-n0ge2265PD5ZVjbZo-9SCp00UJw3rxzc3qKlzHvbTCt-5n8Q403ffKCuYCS59PzN2XYorYewsG2w3mhJS0BVCeVYYnBGifF7ZSYAN6_CgKb7Ctcz6uT-hua5on3YhXTpGhjnsO7anLN7wHcPJOU8WDq9NL2EJjHBGpfYWybY1nznVf7Kbal5A8IZzEgh1KNYBBNhpZ7US6C9bR7z2lCXJEhj06OEMYm5y_65w" \
         -d '{"command":"scanParty","FilterExpression":"lastName = :lastName","ExpressionAttributeValues":{":lastName":"Washington"}}
' \
         -v
    
    
fi
