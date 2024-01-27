const db = require("../../db");
const { NotFoundError } = require("../../expressError");

/** Chat related functions */
class Chat {

    /**
     * Saves message to database after fetching roomId
     */
    static async handleMessage(data, roomName) {
        if (data.type === 'chat'){
            const roomId = await this.getRoomId(roomName);
    
            if (roomId.length === 0) throw new NotFoundError(`No chat room: ${roomName}`);

            await db.query(
                `INSERT INTO messages (room, username, message)
                VALUES ($1, $2, $3)`, [roomId[0].id, data.name, data.text]
            );
        }
    }

    /**
     * Fethches all previous messages in given roomName
     * 
     * Returns [{ name, text }, ...]
     */
    static async getAllMessagesForRoom(roomName) {
        const roomId =  await this.getRoomId(roomName);

        if (roomId.length === 0) throw new NotFoundError(`No chat room: ${roomName}`);

        const messages =  await db.query(
            `SELECT m.message AS text, 
                    m.username AS name
            FROM messages AS m
                LEFT JOIN users AS u ON m.username = u.username
            WHERE m.room = $1
            ORDER BY m.timestamp ASC`, [roomId[0].id]
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

    /** Finds whom the current user chats with by given room id
     * 
     * Returns username and user image
     **/
    static async findWhomCurrentUserChatsWithByRoom(roomId, currentUser) { 
        const otherUsers = await db.query(
            `SELECT u.username,
                    u.img AS "userImg"
            FROM room_members AS rm
                LEFT JOIN users AS u ON rm.username = u.username
            WHERE rm.room = $1 AND rm.username != $2`, [roomId, currentUser]
        );

        return otherUsers.rows.length === 0 ? null : otherUsers.rows[0];
    }


    /**
     * Finds current user's chat rooms in last opened order
     */
    static async findCurrentUserRooms(currentUser) {
        const rooms =  await db.query(
            `SELECT r.id,
                    r.timestamp AS "roomDate"
            FROM room_members AS rm
                LEFT JOIN rooms AS r ON rm.room = r.id
            WHERE rm.username = $1
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
            let roomDetails = {}
            const message =  await db.query(
                `SELECT m.id AS "messageId",
                        m.message,
                        m.timestamp AS "messageDate",
                        u.username
                FROM messages AS m
                    LEFT JOIN users AS u ON m.username = u.username
                WHERE room = $1
                ORDER BY timestamp DESC
                LIMIT 1`, [room.id]
            
            );

            roomDetails.room = room
            roomDetails.message = message.rows[0]
            roomDetails.user = await this.findWhomCurrentUserChatsWithByRoom(room.id, currentUser)
            messages.push(roomDetails)
        }

        return messages
    }

}

module.exports = Chat; 