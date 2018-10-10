# fitApp-fullstack

Fullstack app for custom FRET data analysis.

### Frontend:

- [React](https://reactjs.org)/[D3](https://d3js.org) for interactive UI
- [Webpack](https://webpack.js.org) to manage/bundle assets and build

### Backend:

- python [flask](http://flask.pocoo.org) (RESTful API)
- python [lmfit](https://lmfit.github.io/lmfit-py/) model

### Database:

- [Sqlite](https://www.sqlite.org/index.html) database (local)

<img style="display: block; margin-left: auto; margin-right: auto; width: 100%;" src="https://raw.githubusercontent.com/gcalmettes/fitApp-fullstack/master/sample-data/screenshot-app.png"></img>

# Build and launch the app

1- Build the frontend: 

Install dependencies and build the react/d3 app with webpack.

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