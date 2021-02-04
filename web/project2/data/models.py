class User:
    def __init__(self, displayname, password):
        self.displayname = displayname
        self.password = password
        pass

    def __eq__(self, other):
        return self.displayname == other.displayname

class Channel:
    def __init__(self, name: str):
        self.name: str = name

class Message:
    def __init__(self,id: int, displayname: str, text: str, timestamp):
        self.id = id
        self.displayname = displayname
        self.text = text
        self.timestamp = timestamp # utc

    def asdict(self):
        return {
            "id": self.id,
            "displayname": self.displayname,
            "text": self.text,
            "timestamp": self.timestamp
        }





# # create the channel
# channelname = "one"
# # add the channel to the channel list
# c = Channel(name=channelname)
# # todo: must be unique!
# channels.append(c) 


# # ON THE OTHER HAND

# # create the msg
# message = Message(displayname="kishan", text="hello!!", timestamp="01940293432")
# # set it to the channel
# channels.