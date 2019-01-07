import json

def register(self, firstname, lastname, username, password):
    return self.post(
        '/auth/register',
        data=json.dumps(dict(
            firstname=firstname,
            lastname=lastname,
            username=username,
            password=password
        )),
        content_type='application/json',
    )

def login(self, username, password):
    return self.post(
        '/auth/login',
        data=json.dumps(dict(
            username=username,
            password=password
        )),
        content_type='application/json',
    )

def logout(self, username):
    return self.post(
        '/auth/logout',
        data=json.dumps(dict(
            username=username
        )),
        content_type='application/json',
    )