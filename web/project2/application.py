import os

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_session import Session
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime

from data.models import User, Message
from utils.forms import UserForm

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# config session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Init Flask socket.io
socketio = SocketIO(app)

# Data
# channels: dict = {
#     "channelname": {
#         "messages": [],
#     }, # ...
# }
channels: dict = {}
users: list = []

###############################################
# MAIN PAGES
###############################################
@app.route("/")
def home():
    # verify if user is logged in.
    # if he is not, show the login page. otherwise continue showing home page.
    
    try:
        displayname = session['displayname']
        channelslist = list(channels)

        return render_template("home.html", channels=channelslist, displayname=displayname)

    except KeyError as error:
        return redirect(url_for('login'))
    


###############################################
# AUTHENTICATION PAGES
###############################################
@app.route("/login", methods=['GET', 'POST'])
def login():
    # verify if user is already logged in.
    # if he is, redirect home. otherwise continue showing login page.
    try:
        displayname = session['displayname']
        if displayname is not None:
            return redirect(url_for('home'))
            
    except KeyError as error:
        # User is not logged in. continue on this page.
        pass

    userform = UserForm()
    if userform.validate_on_submit():
        # if the request.method == POST and the form is valid, 
        # login the user and redirect to home

        displayname = userform.displayname.data
        password = userform.password.data

        if any((u.displayname == displayname and u.password == password) for u in users):
            session['displayname'] = displayname
            return redirect(url_for('home'))
        else:
            userform.displayname.errors.append('Display name or password is invalid')


    return render_template('login.html', form=userform)


@app.route("/register", methods=['GET', 'POST'])
def register():
    # verify if user is already logged in.
    # if he is, redirect home. otherwise continue showing login page.
    try:
        displayname = session['displayname']
        if displayname is not None:
            return redirect(url_for('home'))

    except KeyError as error:
        # User is not logged in. continue on this page.
        pass
    
    userform = UserForm()
    if userform.validate_on_submit():
        # if the request.method == POST and the form is valid, 
        # register the user and redirect to home
        displayname = userform.displayname.data
        password = userform.password.data

        # check if user is already registered
        try: 
            user = User(displayname=displayname, password=None)
            i = users.index(user)
            userform.displayname.errors.append('Display name already taken')

        except ValueError as e:
            # Display name available to use.
            # Create the user.
            newuser = User(displayname=displayname, password=password)
            users.append(newuser)
            session['displayname'] = displayname
            return redirect(url_for('home'))


    return render_template('register.html', form=userform)



@app.route("/logout")
def logout():
    session.pop('displayname', None)
    return redirect(url_for('login'))




###############################################
# Socket routes
###############################################
@socketio.on("join channel")
def join_channel(data):
    # the user that is joining the room.
    user_displayname = session['displayname']
    # first check if the channel does not exist.
    channelname = data.get('channelname', None)
    channel = channels.get(channelname, None)
    if channel is None:
        # channel does not exist. abort. cannot join.
        return { "message": "Channel does not exist. Cannot join" }, 404

    # if the channel exists, go on, join in :)
    # but first get out of the current room if in, so you only join one room at a time
    try:
        lastchannel = session['lastchannel']
        print(f"got last channel: {lastchannel}")
        leave_room(room=lastchannel)
    except KeyError:
        pass

    # now join in, and save this room as the last room that was joined in!
    join_room(room=channelname)
    session['lastchannel'] = channelname

    # grab all the messages available on this room.
    messages = channel.get('messages', [])

    response = {
        "channelname": channelname,
        "messages": messages,
    }

    emit('channel joined', response, room=channelname)
    


@socketio.on("leave channel")
def leave_channel(data):
    # the user that is joining the room.
    user_displayname = session['displayname']

    # first check if the channel does not exist.
    channelname = data.get('channelname', None)
    channel = channels.get(channelname, None)
    if channel is None:
        # channel does not exist. abort. cannot join.
        return { "message": "Invalid channel" }, 400
    
    # leave
    leave_room(room=channelname)


@socketio.on("create channel")
def create_channel(data):
    channelname = data.get('channelname', None)

    # first check if the channel already exists
    channel = channels.get(channelname, None)
    if channel is not None:
        # channel exists. abort creation.
        emit('channel created', {})
        return 'A channel already exists with this name. Cannot create a new channel', 400;

    # if the channel does not exists. create it
    # messages will hold the messages this channel will receive.
    channels[channelname] = {
        'messages': []
    }
    emit('channel created', {"channelname": channelname}, broadcast=True)
    return 'Channel created!', 200


@socketio.on("send message")
def send_message(data):
    channelname = data.get('channelname', None)
    textmessage = data.get('text', None)
    displayname = data.get('displayname', None)
    timestamp = datetime.utcnow().strftime("%m/%d/%Y, %H:%M:%S");

    channel = channels.get(channelname, None)
    if channel is None:
        # channel does not exist.
        # TODO handle!
        return "Could not find the channel", 404

    # maximum messages storage = 100.
    messages = channel.get('messages', [])
    if len(messages) == 100:
        delete_message({'msgIndex': 0, 'channelname': channelname})

    newId: int = 0
    try:
        lastAddedId = messages[-1]['id'];
        newId = lastAddedId + 1

    except:
        # no messages in this channel, id will be 0 (newid=0) for the first message.
        pass

    message = Message(id=newId, displayname=displayname, text=textmessage, timestamp=timestamp)
    messages.append(message.asdict())

    emit('message sent', message.asdict(), room=channelname)



@socketio.on("delete message")
def delete_message(data):
    channelname = data.get('channelname', None) # the channel name where the message is.
    msgid = data.get('msgid', None) # the id of the msg on the channel to be deleted
    
    if msgid is not None:
        # Delete the message
        try:
            channel = channels.get(channelname)
            messages = channel.get('messages', [])
            
            for message in messages:
                if message['id'] == msgid:
                    messages.pop(messages.index(message))
                    break

            emit('message deleted', data, room=channelname)
        except Exception as e:
            print(e)
            pass





###############################################
# APIS
###############################################
@app.route("/api/user/<string:displayname>", methods=['GET'])
def api_displayname_available(displayname):
    try: 
        user = User(displayname=displayname, password="")
        i = users.index(user)
        # Display Name already exists
        return 'Not Available', 404;

    except ValueError as e:
        # Display name available to use
        return 'Available', 200