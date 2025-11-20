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
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/requests
- GET /user/connections
- GET /user/feed - gets you the feed of peoples you can match with. 

Status: ignored,interested,accepted,rejected