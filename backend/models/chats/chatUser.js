const { SendMessageError } = require("../../expressError");

// Room is an abstraction of a chat channel
const { Room } = require('./room');

/** 
 * ChatUser is an individual connection from client -> server to chat.
 */
class ChatUser {
  /** make chat: store connection-device, room */
  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.roomName = roomName; // room name user will be in
    this.room = null; // room name user will be in
    this.name = null;  // becomes the username of the visitor
    this.receiver = null;  // becomes the receiver
  }

  /** 
   * Asynchronous function to initialize the room.
   */
  async initializeRoom() {
    // Wait for Room.get() to resolve
    const room = await Room.get(this.roomName);
    this.room = room;

    console.log(`created chat in ${this.room.name}`);
  }


  /** 
   * Send msgs to this client using underlying connection-send-function 
   */
  send(data) {
    try {
      this._send(data);
    } catch (err) {
        console.error("Error in sending message at server side:", err);
        throw new SendMessageError("Error sending message to client side");
    }
  }

  /** 
   * Add to room members, announce join 
   */
  async handleJoin(name, receiver) {
    if(!this.room) await this.initializeRoom()

    this.name = name;
    this.receiver = receiver;
    await this.room.join(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} joined "${this.room.name}".`
    });
  }

  /** 
   * Handle a chat: broadcast to room. 
   */
  handleChat(text) {
    const currentDate = new Date();
    
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text,
      date: currentDate.toISOString(),
    });
  }
  
  /**
   * Show message only to current user
   */
  handleShow(data) {
    this.room.show(this, data);
  }

  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   */
  async handleMessage(msg) {

    if (msg.type === 'join') await this.handleJoin(msg.name, msg.receiver);
    else if (msg.type === 'chat') this.handleChat(msg.text);
    else throw new Error(`bad message: ${msg.type}`);
  }

  /** 
   * Connection was closed: leave room, announce exit to others 
   */
  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: 'note',
      text: `${this.name} left ${this.room.name}. They will see your messages when they get back online`
    });
  }
}

module.exports = ChatUser;
