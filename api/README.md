# rest-api-sql

A REST API using Express. This API provides a way to administer a school database containing information about users and courses. Users can interact with the database to create new courses, retrieve information on existing courses, and update or delete existing courses. To make changes to the database, users will be required to log in so the API will also allow users to create a new account or retrieve information on an existing account.

Used knowledge of Node.js, Express, REST APIS, and Sequelize to test the application with Postman, a popular application for exploring and testing REST APIs.

Installations:
    dependencies -npm install
    sequelize -npm install --save sequelize
    sequelize-cli -npm install --save-dev sequelize-cli

-Initialized project using the `npx sequelize init` command.

start application 
    -npm run seed 
    -npm start

.gitignore
    node modules 

config
    Updated the development environment object of the config.js file so that the storage key has a value of "fsjstd-restapi.db" and dialect key has a value of “sqlite”.


    