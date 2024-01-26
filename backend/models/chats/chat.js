const db = require("../../db");
const { NotFoundError } = require("../../expressError");

/** Chat related functions */
class Chat {

    /**
     * Saves message to database after fetching roomId
     */
    static async handleMessage(data, roomName) {
        const roomId = await this.getRoomId(roomName);

        if (roomId.length === 0) throw new NotFoundError(`No chat room: ${roomName}`);
        
        await db.query(
            `INSERT INTO messages (room, username, message)
            VALUES ($1, $2, $3)`, [roomId[0], data.name, data.text]
        );
    }

    /**
     * Fethches all previous messages in given roomName
     * 
     * Returns [{ messageId, username, userImg, message, date }, ...]
     */
    static async getAllMessagesForRoom(roomName) {
        const roomId =  await this.getRoomId(roomName);

        if (roomId.length === 0) throw new NotFoundError(`No chat room: ${roomName}`);

        const messages =  await db.query(
            `SELECT m.id AS "messageId",
                    m.message, 
                    m.timestamp AS "date",
                    m.username, 
                    u.img AS "userImg"
            FROM messages AS m
                LEFT JOIN users AS u ON m.username = u.username
            WHERE m.room = $1
            ORDER BY m.timestamp ASC`, [roomId[0]]
        );
        
        return messages.rows
    }

    /** Checks if room exist 
     * 
     *  Gets room ID by room name
     **/
    static async getRoomId(roomName) { 
        const roomId =  await db.query(
            `SELECT id
            FROM rooms
            WHERE name = $1`, [roomName]
        );

        return roomId.rows
    }

    /**
     * Finds current user's chat rooms in last opened order
     */
    static async findCurrentUserRooms(currentUser) {
        const rooms =  await db.query(
            `SELECT r.id
            FROM room_members AS rm
                LEFT JOIN rooms AS r ON rm.room = r.id
            WHERE rm.user = $1
                ORDER BY r.timestamp DESC`, [currentUser]
        );

        return rooms.rows
    }

    /**
     * Finds users from current user's chat rooms in last opened order
     * Finds last messages and users in each room
     */
    static async findUserMessages(currentUser) {
        const rooms = await this.findCurrentUserRooms(currentUser)
        const messages = []
        for(let room of rooms) {
            const message =  await db.query(
                `SELECT m.id AS "messageId",
                        m.message,
                        u.username,
                        u.img AS "userImg"
                FROM messages AS m
                    LEFT JOIN users AS u ON m.username = u.username
                WHERE room = $1
                ORDER BY timestamp DESC
                LIMIT 1`, [room]
            
            );
            messages.push(message.row[0])

        }

        return messages
    }

}

module.exports = Chat; 