# How to run

Create a .env file in the root directory with the following properties, replacing \<values\> with the appropriate secret values. 
```
ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.qkybc.mongodb.net/<dbname>?retryWrites=true&w=majority
BUCKET=shopit-item-images
ACCESS_KEY=<secret>
PRIVATE_KEY=<secret>
```

Install dependencies and run the server. 
```
npm ci
npm start
```

Linting instructions (lint:fix attempts to automatically resolve some warnings):
```
npm run lint
npm run lint:fix
```

Testing instructions (test:coverage generates coverage statistics and enforces coverage thresholds):
```
npm run test
npm run test:coverage
```

## Documentation

https://documenter.getpostman.com/view/6616705/TVmPBdCv
