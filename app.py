from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

scoreboard = {
    "score": 0,
    "tasks": [
        {"id": 1, "name": "Refactor portal UI", "status": "pending"},
        {"id": 2, "name": "Fix login bug", "status": "in_progress"},
        {"id": 3, "name": "Update README", "status": "pending"}
    ],
    "files": [
        "C:/Users/tyler/Desktop/start_portal.bat",
        "C:/Users/tyler/CascadeProjects/scoreboard/scoreboard.py",
        "C:/Users/tyler/CascadeProjects/scoreboard/cascade_scoreboard.py"
    ],
    "current_file": "C:/Users/tyler/CascadeProjects/scoreboard/scoreboard.py"
}

@app.route('/api/score', methods=['GET', 'POST'])
def score():
    if request.method == 'POST':
        data = request.json
        scoreboard["score"] = data.get("score", scoreboard["score"])
        return jsonify(score=scoreboard["score"])
    return jsonify(score=scoreboard["score"])

@app.route('/api/tasks', methods=['GET', 'POST', 'PUT', 'DELETE'])
def tasks():
    if request.method == 'GET':
        return jsonify(tasks=scoreboard["tasks"])
    elif request.method == 'POST':
        task = request.json
        task["id"] = max([t["id"] for t in scoreboard["tasks"]] + [0]) + 1
        scoreboard["tasks"].append(task)
        return jsonify(task=task)
    elif request.method == 'PUT':
        task = request.json
        for t in scoreboard["tasks"]:
            if t["id"] == task["id"]:
                t.update(task)
                return jsonify(task=t)
        return jsonify(error="Task not found"), 404
    elif request.method == 'DELETE':
        task_id = request.args.get("id", type=int)
        scoreboard["tasks"] = [t for t in scoreboard["tasks"] if t["id"] != task_id]
        return jsonify(tasks=scoreboard["tasks"])

@app.route('/api/files', methods=['GET', 'POST', 'PUT'])
def files():
    if request.method == 'GET':
        return jsonify(files=scoreboard["files"], current_file=scoreboard["current_file"])
    elif request.method == 'POST':
        file = request.json.get("file")
        if file and file not in scoreboard["files"]:
            scoreboard["files"].append(file)
        return jsonify(files=scoreboard["files"])
    elif request.method == 'PUT':
        scoreboard["current_file"] = request.json.get("current_file", scoreboard["current_file"])
        return jsonify(current_file=scoreboard["current_file"])

@app.route('/')
def index():
    return '''<h2>Cascade Scoreboard MCP</h2><ul><li><a href="/api/score">Score API</a></li><li><a href="/api/tasks">Tasks API</a></li><li><a href="/api/files">Files API</a></li></ul>'''

if __name__ == '__main__':
    app.run(debug=True)
