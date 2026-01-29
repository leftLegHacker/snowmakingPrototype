from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Global valve states
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
        "v1": valve1,
        "v2": valve2
    })

if __name__ == "__main__":
    app.run(debug=True)
