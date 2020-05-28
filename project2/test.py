class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email



users: list = []

user = User("kishan", "kishan_jadav@hotmail.com")
user1 = User("kishan", "kishan_jadav@hotmail.com")
user2 = User("kishan", "kishan_jadav@hotmail.com")

users.append(user)
users.append(user1)
users.append(user2)

print(len(users))
