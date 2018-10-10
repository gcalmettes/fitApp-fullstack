# fitApp-fullstack
Fullstack app (flask API backend, python model (lmfit), SQL database, webpack/react frontend) to analyse scientific data

# Build and launch the app

1- Frontend: install dependencies and build the react app with webpack
```
# in 'frontend' folder
npm install
npm run build
```

2- Export the FLASK_APP environment variable
```
# (in root folder)
export FLASK_APP=backend

# optionally set the environment to DEBUG mode
export FLASK_ENV=development
```

3- Initialize empty sqlite3 database
```
# (in root folder)
flask init-db
```