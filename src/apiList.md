# devTinder Api's

## authRouter
- POST /auth/signup
- POST /auth/login
- Post /auth/logout

## profileRouter
- GET /profile/view
- PATCH /profile/update
- PATCH /profile/password/update

## requestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - gets you the feed of peoples you can match with. 

Status: ignored,interested,accepted,rejected