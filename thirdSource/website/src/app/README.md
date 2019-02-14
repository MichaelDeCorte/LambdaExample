
/security ->
login.component.ts:login() ->
/AWS Login Page authenticates user and returns code ->
/security/authenticate() ->
auth-resove.service.ts:Resolve() ->
auth-resove.service.ts:getToken() ->
/AWS gets Code and returns Token
authenticate.component.ts:authenticate() ->
/home

/security ->
login.component.ts:logout ->
/AWS Logout
/home    