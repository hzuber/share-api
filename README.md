# Share API
###### https://fathomless-refuge-14037.herokuapp.com

The api for the Share My Stuff app was created with Node JS. It uses a database with tables for the users and the items.
The items use the primary key of the users app as a foreign key to keep track of whos the items belong
to. The api uses Express, Morgan, CORS and Knex. For testing I used supertest and mocha. 

There is currently no authentication. 

## API Documentation

The Share API is organized around REST. It accepts standard GET, POST, PATCH and DELETE requests for users and items. The API returns JSON encoded responses.

All API calls begin with: https://fathomless-refuge-14037.herokuapp.com/api/

### Users

GET /users
GET /users/:user_id
GET /users/:user_id/items
POST /users
PATCH /users/:user_id
DELETE /users/:user_id


### Items

GET /items
GET /items/item_id
POST /items
PATCH /items/:item_id
DELETE /items/:item_id