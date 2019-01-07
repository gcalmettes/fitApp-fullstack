# Whydah

The [Whydah Gally](https://en.wikipedia.org/wiki/Whydah_Gally), commonly known simply as the Whydah, was a pirate ship was believed to hold treasure from more than 50 ships when it sank in a storm off the coast of Cape Cod on April 26, 1717.

This repo contains the barebone Flask app (React/Redux frontend) that power the lab most valuable data. It will hopefully never sink.

### Frontend:

- [React](https://reactjs.org)/[Redux](https://redux.js.org)/[D3](https://d3js.org) for interactive UI
- [Rxjs](https://rxjs-dev.firebaseapp.com) to handle asynchronous events
- [Webpack](https://webpack.js.org) to manage/bundle assets and build

### Backend:

- python [flask](http://flask.pocoo.org) (RESTful API)

### Database:

- [Sqlite](https://www.sqlite.org/index.html) database (local)

# Build and launch the app

1. Build the frontend: 

Install dependencies and build the react/d3 app with webpack.

In the `frontend` folder:

```
npm install
npm run build
```

2. Export the FLASK_APP environment variable

In the repository folder:

```
export FLASK_APP=backend

# optionally set the environment to DEBUG mode
export FLASK_ENV=development
```

3. Initialize empty SQLite database

In the repository folder:

```
# (in root folder)
flask init-db
```

4. Launch the app

In the repository folder:

```
flask run

# if the server needs to be externally visible:
# flask run --host=0.0.0.0
```

go to `http://127.0.0.1:5000/`
