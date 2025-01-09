#import sqlite3
#
#base = sqlite3.connect('users.db')
#
#cursor = base.cursor()
#
#cursor.execute('''CREATE TABLE IF NOT EXISTS users
#             (birthday text, name text, school text)''')
#
#def addUser(name, birthday, school):
#    cursor.execute("INSERT INTO users VALUES (" + birthday + ", " + name + ", " + school + ")")
#    base.commit()
#
#base.close()

import mysql.connector


