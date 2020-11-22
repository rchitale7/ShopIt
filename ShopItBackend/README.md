# How to run

Create a .env file in the root directory with the following properties, replacing <username> with username, <password> with password, and <dbname> with "ShopIt":
```
ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.qkybc.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Install dependencies and run the server. Nodemon automatically refreshes the server everytime a change is made to the source code.
```
npm install
npx nodemon server.js
```

Linting instructions:
```
npx eslint .
```
