import json
from flask import Flask, jsonify, request

app = Flask("factflow")
members = [{ 'id': 1, 'name': 'Laksh' }, 
                { 'id': 2, 'name': 'Avik' }, 
                { 'id': 3, 'name': 'Harsha' }, 
                { 'id': 4, 'name': 'Arnav' }]

nextMemberId = 4

@app.route('/members', methods=['GET'])
def get_members():
 return jsonify(members)


@app.route('/members/<int:id>', methods=['GET'])
def get_member_by_id(id: int):
    member = get_member(id)
    if member is None:
        return jsonify({ 'error': 'Member does not exist'}), 404
    return jsonify(member)

def get_member(id):
    return next((m for m in members if m['id'] == id), None)

def member_is_valid(member):
    for key in member.keys():
        if key != 'name':   
            return False
        return True
    


@app.route('/members', methods=['POST'])
def create_members():
    member = json.loads(request.data)
    if not member_is_valid(member):
        return jsonify({ 'error': 'Invalid member properties.' }), 400

    member['id'] = nextMemberId
    nextMemberId += 1
    members.append(member)

    return '', 201, { 'location': f'/members/{member["id"]}' }


@app.route('/members/<int:id>', methods=['PUT'])
def update_member(id: int):
    member = get_member(id)
    if member is None:
        return jsonify({ 'error': 'Member does not exist.' }), 404

    updated_member = json.loads(request.data)
    if not member_is_valid(update_member):
        return jsonify({ 'error': 'Invalid member properties.' }), 400

    member.update(update_member)

    return jsonify(member)


@app.route('/members/<int:id>', methods=['DELETE'])
def delete_member(id: int):
    member = get_member(id)
    if member is None:
        return jsonify({ 'error': 'Member does not exist.' }), 404

    members = [m for m in members if m['id'] != id]
    return jsonify(member), 200

if __name__ == '__main__':
   app.run(port=5000)
