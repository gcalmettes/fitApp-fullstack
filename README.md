# fitApp-fullstack

Fullstack app for custom data fitting.

### Frontend:

- [React](https://reactjs.org)/[Redux](https://redux.js.org)/[D3](https://d3js.org) for interactive UI
- [Rxjs](https://rxjs-dev.firebaseapp.com) to handle asynchronous events
- [Webpack](https://webpack.js.org) to manage/bundle assets and build

### Backend:

- python [flask](http://flask.pocoo.org) (RESTful API)
- python [lmfit](https://lmfit.github.io/lmfit-py/) model

### Database:

- [Sqlite](https://www.sqlite.org/index.html) database (local) [easily configurable for remote DB]

<img style="display: block; margin-left: auto; margin-right: auto; width: 100%;" src="https://raw.githubusercontent.com/gcalmettes/fitApp-fullstack/master/sample-data/screenshot-app.png"></img>

# Build and launch the app

1. Build the frontend: 

Install dependencies and build the react/d3 app with webpack.

In the `frontend` folder:

```
npm install
npm run build
```

2. Set up your configuration variables

See `__init__.py` file in the `config` folder.

3. Initialize empty SQLite database

In the repository folder:

```
python run.py --initdb
```

4. Run the backend

In the repository folder:

```
python run.py [--options]
```

Options available:

    - `--dev` (Watch for static files changes)
    - `--host` (Specify host to serve, default=`127.0.0.1`)
    - `--port` (Specify port to serve, default=5000)
    - `--initdb`, (Initialize database)
    - `--test` (Run the test suite)

5. Launch the app

Open a browser and go to `http://127.0.0.1:5000/` (or the specific host/port defined by your options)
