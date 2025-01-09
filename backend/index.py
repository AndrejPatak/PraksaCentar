from flask import Flask, jsonify, request
from flask_cors import CORS

from MySQLdb import _mysql as db

app = Flask(__name__,
        static_url_path='', 
        static_folder='images')
CORS(app)

# returns hello world when we use GET. 
# returns the data that we send when we use POST. 
@app.route('/latest-event', methods = ['GET']) 
def home(): 
    if(request.method == 'GET'): 
        return jsonify(getLatestEvent()) 
   
def getLatestEvent():
    latestEvent = {"name":"M:tel app", "description":"M:tel app takimcenje je mtelovo godisnje takmicenje za iskazivanje najboljih ideja...", "icon":"https://cdn.skenda.me/mtel-ikona.png", "event":"competition"} 
    return latestEvent

@app.route('/test-db', methods = ['GET'])
def testDB():
    praksaCentarDb = db.connect(host="localhost",user="bery",passwd="l4mpe/pr4ks4",db="praksa_centar")
    praksaCentarDb.query("""SELECT * FROM users;""")

    data = praksaCentarDb.store_result()
    result = data.fetch_row(maxrows=0) 
    
    users = []
    for row in result:    
        users.append({
        "id": row[0].decode(),
        "username": row[1].decode(),
        "password": row[2].decode(),
        "email": row[3].decode()
        })

    return jsonify(users[0]) 
    pass
    

  
# driver function 
if __name__ == '__main__': 
  
    app.run(host='0.0.0.0', port=5050, debug=True)
    #app.run(host='0.0.0.0', port=443, ssl_context=(
     #   '/etc/letsencrypt/live/cdn.skenda.me/fullchain.pem',
      #  '/etc/letsencrypt/live/cdn.skenda.me/privkey.pem'))

