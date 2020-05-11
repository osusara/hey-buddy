# User

### auth [User]

    -test route [GET api/auth]
    -authentication (login) [POST api/auth]

### user [User]

    -register user [POST api/user]
    -activate/deactivate [PUT api/user]

### profile [Profile]

    -get my profile [GET api/profile/me]
    -create/update profile [POST api/profile]
    -get all profiles [GET api/profile]
    -get profile by id [GET api/profile/user/:user_id]

### buddy [Buddy]

    -get my buddies [GET api/buddy/me]
    -add buddy [POST api/buddy]
    -remove buddy [PUT api/buddy/:user_id]
    -get buddies of other user [GET api/buddy/:user_id]
    -mark a buddy as special/unspecial [PUT api/buddy/special/:user_id]

### challenge [Challenge] - didn't complete

    -create a challenge with a random dare [POST api/challenge] - not functioning correctly (buddy and privacy check of the receivers)
    -get buddies' challenges [GET api/challenge]
    -get my challenge [GET api/challenge/me]
    -get challenge id [GET api/challenge/:challenge_id]
    -open/close challenge [PUT api/challenge/:challenge_id]
    -delete challenge [DELETE api/challenge/:challenge_id]

### post [Post] - didn't complete

    -create a post [POST api/post]
    -get buddies' [GET api/post]
    -get my posts [GET api/post/me]
    -get a post by id [GET api/post/:post_id]
    -delete a post [DELETE api/post/:post_id]
    -highfive a post [PUT api/post/like/:post_id]
    -remove highfive [PUT api/post/unlike/:post_id]
    -reply a post [PUT api/post/reply/:post_id]
    -delete a reply [DELETE api/post/reply/:post_id/:reply_id]


# Admin

### _auth [Admin]

    -test route [GET api/_auth]
    -authentication (login) [POST api/_auth]

### admin [Admin]

    -register admin [POST api/admin]
    -activate/deactivate [PUT api/admin]

### _privilages [User, Profile, Post, Challenge]
    
    -delete profile/user/posts permenantly [DELETE api/user/:user_id]

### dare [Dare]

    -create a dare [POST api/dare]
    -get all dares [GET api/dare]
    -get my dares [GET api/dare/me]
    -get a dare by id [GET api/dare/:dare_id]
    -update a dare [PUT api/dare/:dare_id]
    -delete a dare [DELETE api/dare/:dare_id]
