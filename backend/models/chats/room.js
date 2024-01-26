const db = require("../../db");
// in-memory storage of roomNames -> room
const ROOMS = new Map();

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

    if(roomId.rows.length === 0) {
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
        WHERE id = $1`, [roomId.rows[0].id]
      );
    }

    if (!ROOMS.has(roomName)) {
      ROOMS.set(roomName, new Room(roomName));
    }

    return ROOMS.get(roomName);

  }

  /** 
   * Make a new room, starting with empty set of listeners
  */
  constructor(roomName, members=[]) {
    this.name = roomName;
    this.members = new Set(members);
  }

  /** Joins members a room.
   * Checks if chat member was already in database
   */
  async join(member) {
    const roomId  =  await db.query(
      `SELECT id
      FROM rooms
      WHERE name = $1`, [this.name]
    );

    const existingMember  =  await db.query(
        `SELECT user
        FROM room_members
        WHERE room = $1 AND user = $2`, [roomId.rows[0].id, member]
    );

    if(!existingMember.rows) {
        await db.query(
            `INSERT INTO room_members (room, user)
             VALUES ($1, $2)`, [roomId.rows[0], member]
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
