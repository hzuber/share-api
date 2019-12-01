# Share API
###### https://fathomless-refuge-14037.herokuapp.com

The api for the Share My Stuff app was created with Node JS. It uses a database with tables for the users and the items.
The items use the primary key of the users app as a foreign key to keep track of whos the items belong
to. 

Items can be pulled either by email or user id. To post an item a name must be suppplied, as well as what type of 
item it is and whether it is borrowed or not. However, the Share My Stuff app always supplies an empty string
as the name, so it isn't functionally required. 

There is currently no authentication. 