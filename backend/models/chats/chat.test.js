const { Room, ROOMS } = require('./room');
const Chat = require("./chat.js");
const { NotFoundError } = require("../../expressError");
const db = require("../../db.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../_testCommon.js");

describe("Chat class", () => {
    beforeAll(commonBeforeAll);
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);
    afterAll(commonAfterAll);
  
    /************************************** handleMessage */
    describe("handles incoming server messages", function () {
      test("save message to database", async function () {
        let messages = await Chat.getAllMessagesForRoom('chatRoom1');
        expect(messages.length).toBe(3);
        await Chat.handleMessage({type: 'chat', name:'u1', text:'test'}, 'chatRoom1');
        messages = await Chat.getAllMessagesForRoom('chatRoom1');
        expect(messages.length).toBe(4);
      });

      test('should throw NotFoundError if room does not exist', async () => {
        try {
            await Chat.handleMessage({type: 'chat', name:'u1', text:'test'}, 'nope');
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
      });
    });

    /************************************** getAllMessagesForRoom */
    describe("find previous messages", function () {
        test("finds previous messages with given roomName", async function () {
            let messages = await Chat.getAllMessagesForRoom('chatRoom1');
            expect(messages.length).toBe(3);
            await Chat.handleMessage({type: 'chat', name:'u1', text:'test'}, 'chatRoom1');
            messages = await Chat.getAllMessagesForRoom('chatRoom1');
            expect(messages.length).toBe(4);
        });

        test('should throw NotFoundError if room does not exist', async () => {
            try {
                await Chat.getAllMessagesForRoom('nope');
            } catch (err) {
                expect(err instanceof NotFoundError).toBeTruthy();
            }
        });
    });  
    
    /************************************** getRoomId */
    describe('getRoomId method', () => {
          test("should checkif room exist in database", async function () {
              const room = await Chat.getRoomId('chatRoom1');
              expect(room).toEqual([ { id: 1000 } ]);
          });
  
          test("should return empty array if no book", async function () {
            const room = await Chat.getRoomId('nope');
            expect(room).toEqual([]);
          });
    });
    
    /************************************** findWhomCurrentUserChatsWithByRoom */
    describe('findWhomCurrentUserChatsWithByRoom method', () => {
        test("Finds whom the current user chats with by given room", async function () {
            const receciver = await Chat.findWhomCurrentUserChatsWithByRoom(1000, 'u1');
            expect(receciver).toEqual({username: 'u2', userImg: 'img2'});
        });

        test("should return empty array if no book", async function () {
            const receciver = await Chat.findWhomCurrentUserChatsWithByRoom(5, 'u1');
          expect(receciver).toEqual(null);
        });
    });
    
    /************************************** findCurrentUserRooms */
    describe('findCurrentUserRooms method', () => {
        test("Finds current user opened room in chronogical order", async function () {
            const rooms = await Chat.findCurrentUserRooms('u1');
            expect(rooms).toEqual([
                {
                    id: 1000,
                    roomDate: expect.any(Date),
                },
                {
                    id: 2000,
                    roomDate: expect.any(Date),
                }
            ]);
        });

        test("should return empty array if no book", async function () {
            const rooms = await Chat.findCurrentUserRooms('u3');
          expect(rooms).toEqual([]);
        });
    });
    
    /************************************** findUserMessages */
    describe('findUserMessages method', () => {
        test("Finds last messages of each chat room with given username", async function () {
            const messages = await Chat.findUserMessages('u1');
            expect(messages).toEqual([
                {   message: {
                        message: 'Msg1',
                        messageDate: expect.any(Date),
                        messageId: 1000,
                        username:'u1'
                    },
                    room: {
                        id: 1000,
                        roomDate: expect.any(Date),
                    },
                    user: {
                        username: 'u2',
                        userImg: 'img2'
                    }
            },
            {   message: null,
                room: {
                    id: 2000,
                    roomDate: expect.any(Date),
                },
                user: null
            }]);
        });

        test("should return empty array if no book", async function () {
            const rooms = await Chat.findUserMessages('u3');
          expect(rooms).toEqual([]);
        });
    });
  
});
  