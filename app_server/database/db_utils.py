from sqlalchemy import create_engine
from sqlalchemy.exc import DatabaseError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Mix of 2 patterns:
# 1) Dynamically initialize engine according to app configuration (e.g.: prod vs testing)
# pattern from http://flask.pocoo.org/snippets/22/ (see last comment)
# 2) Abstract away db session for no need to pass session around everywhere
# pattern from https://chase-seibert.github.io/blog/2016/03/31/flask-sqlalchemy-sessionless.html 
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

engine = None

sessionmaker = sessionmaker()
db_session = scoped_session(sessionmaker)


class BaseModel(object):

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def save(self):
        db_session.add(self)
        self._flush()
        return self

    def update(self, **kwargs):
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return self.save()

    def delete(self):
        db_session.delete(self)
        self._flush()

    def _flush(self):
        try:
            # we could commit here, but we won't, only flush
            # Only 1 commit per request, that will be done via @app.teardown_appcontext
            # function registered during create_app. Document flushes changes needed to be
            # committed via a 'to_commit' variable bound on session.info.
            db_session.flush()
            db_session.info['to_commit'] = True
        except DatabaseError:
            db_session.rollback()
            raise


myBase = declarative_base(cls=BaseModel)
myBase.query = db_session.query_property()


def init_engine(uri, clear_db=False):
    global sessionmaker, engine, db_session

    engine = create_engine(uri)
    db_session.remove()
    sessionmaker.configure( autocommit=False, 
                            autoflush=False,
                            bind=engine)
    if clear_db:
        # create tables if they do not exist
        from app_server.models import User, Log, DataFit
        myBase.metadata.create_all(bind=engine)
        # and clear the tables if they had data in them
        for table in reversed(myBase.metadata.sorted_tables):
            db_session.execute(table.delete())
        db_session.commit()
        print('Database cleared.')
        
    else:
        # create tables if they do not exist
        from app_server.models import User, Log
        myBase.metadata.create_all(bind=engine)
