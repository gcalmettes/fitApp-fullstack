# fitApp-fullstack

Fullstack app for custom FRET data analysis.

### Frontend:

- react
- webpack to build and manage sources

### Backend:

- python flask API
- python lmfit model

### Database:

- sqlite database (local). Can easily be switched to cloud-based database.

<img style="display: block; margin-left: auto; margin-right: auto; width: 100%;" src="https://raw.githubusercontent.com/gcalmettes/fitApp-fullstack/master/sample-data/screenshot-app.png"></img>

# Build and launch the app

1- Build the frontend: 

Install dependencies and build the react app with webpack.

In the `frontend` folder:

```
npm install
npm run build
```

2- Export the FLASK_APP environment variable

In the repository folder:

```
export FLASK_APP=backend

# optionally set the environment to DEBUG mode
export FLASK_ENV=development
```

3- Initialize empty sqlite3 database

In the repository folder:

```
# (in root folder)
flask init-db
```

4- Launch the app

In the repository folder:

```
flask run
```

go to `http://127.0.0.1:5000/`