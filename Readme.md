# ContactsAPI v1.0.0

## Description

This API allows you to create and maintain contacts similarly like we have a phonebook with features provided through
API endpoints. This API is created using ExpressJs and MongoDB.

## Local development

- In the project directory run this command to install necessary dependencies
- ```shell
  npm install
  ```
- Environment variables required by this project
    - `HOST`
    - `PORT`
    - `MONGODB_URL`
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
    - `LOG_DIR`
    - `LOG_LEVEL`
    - `NODE_ENV`

## With docker

- Before running make sure that docker is installed.
- In the project directory run this command
- ```shell
  docker compose up
  ```
- Pass the required environment variables

### Versions

```text
1. Base commit
2. Api routes available
   1. /health [GET]
    This returns a json indicating that server is healthy and running properly.
   2. /api/contacts/create [POST]
    It creates new contacts in the database with provided parameters.
   3. /api/contacts/:id [PATCH]
    Modifies existing contacts with new updated data.
   4. /api/contacts/:id [DELETE]
    Deletes existing contact
   5. /api/contacts/:id/:infoId [PATCH]
    It modifies existing contact number associated with particular user(contact).
   6. /api/contacts/:id/:infoId [DELETE]
    It deletes contact info for particular contact.
   7. /api/contacts/query [GET]
    This method is used to filter out contacts, contactInfo, search through database for particular contact using name and number.
```