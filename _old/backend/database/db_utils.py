import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext

dbname = 'fitdata'

def get_db_name(dbname=dbname):
  return dbname


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('database/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


def execute_query(query, args=()):
    cur = get_db().execute(query, args)
    rows = cur.fetchall()
    cur.close()
    return rows


def addRecord(record):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"""INSERT INTO {dbname} VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", record)
    db.commit()

def deleteRecord(id_to_delete):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"""DELETE FROM {dbname} WHERE ID={id_to_delete}""")
    db.commit()


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(export_db_command)


# initialize database
# >> flask init-db
@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

# export database to csv
# >> flask export-db
@click.command('export-db')
@with_appcontext
def export_db_command():
    """Export existing database to csv"""
    import pandas as pd
    name = get_db_name()
    conn = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
    filename = f"instance/{name}.csv"
    df = pd.read_sql_query(f'SELECT * FROM {name}', conn)
    df.to_csv(filename, index=False)
    conn.close()
    click.echo(f'Exported the database to {filename}.')


