const db = require("../../db");

/** 
 * Chat rooms that can be joined/left/broadcast to. 
 * Room is a collection of listening members; this becomes a "chat room"
 * Where individual users can join/leave/broadcast to.
 */
class Room {

  /** Get room by that name, creating if nonexistent
   *
   * If it exists in the database,updates timestamp;
   * if it doesn't exist, creates a new room with a timestamp.
   * This uses a programming pattern often called a "registry."
   **/
  static async get(roomName) {
    const roomId  =  await db.query(
        `SELECT id
        FROM rooms
        WHERE name = $1`, [roomName]
    );

    if(roomId.length === 0) {
      // If the room doesn't exist, create a new one with a timestamp
      await db.query(
          `INSERT INTO rooms (name)
          VALUES ($1)`, [roomName]
      );
    } else {
      // If the room exists, update the timestamp
      await db.query(
        `UPDATE rooms
        SET timestamp = CURRENT_TIMESTAMP
        WHERE id = $1`, [roomId[0].id]
      );
    }

    return new Room(roomName)
  }

  /** 
   * Make a new room, starting with empty set of listeners
  */
  constructor(roomName) {
    this.name = roomName;
    this.members = new Set();
  }

  /** Joins members a room.
   * Checks if chat member was already in database
   */
  async join(member) {
    const existingMember  =  await db.query(
        `SELECT user
        FROM room_members
        WHERE room = $1 AND user = $2`, [this.name, member]
    );

    if(!existingMember ) {
        await db.query(
            `INSERT INTO room_members (room, user)
             VALUES ($1, $2)`, [this.name, member]
        );    
    }

    this.members.add(member);
  }

  /** 
   * Member leaving current room instance.
   */
  leave(member) {
    this.members.delete(member);
  }

  /** 
   * Show data to a specific member in the room. 
   */
  show(member, data) {
    member.send(JSON.stringify(data))
  }

  /**
   * Send message to all members in a room.
   */
  broadcast(data) {
    for (let member of this.members) {
      member.send(JSON.stringify(data));
    }
  }
}

module.exports = Room;
