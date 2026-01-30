from flask import Flask, render_template, jsonify

app = Flask(__name__)

'''
Global valve states
this is going to have to change as we will need to keep the state in the database and update
the DB to keep the record if everything crasses then reload form last state
'''
valve1 = False
valve2 = False

@app.route("/")
def index():
    return render_template("index.html", v1=valve1, v2=valve2)

@app.route("/toggle/<int:valve_id>")
def toggle(valve_id):
    global valve1, valve2

    if valve_id == 1:
        valve1 = not valve1
    elif valve_id == 2:
        valve2 = not valve2

    return jsonify({
     '''   
    {"v1": true, "v2": false} returns html response or what ever the vales are T or false
     jsonify creates the JSON string and a flask response instead of complicating flask with a
     JSON dump this does both at the same time and works better accross more browsers
     '''
        "v1": valve1,
        "v2": valve2
    })
'''
https://www.geeksforgeeks.org/python/switch-case-in-python-replacement/
this may be a route to go as well for each valve to go into diffrent states and what we need to do in each change

'''
if __name__ == "__main__":
    app.run(debug=True)
