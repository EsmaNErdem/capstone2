const { Room } = require('./room');
const ChatUser = require('./chatUser');

// Mock the underlying send function
const mockSend = jest.fn();
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../_testCommon.js");

describe("ChatUser class", () => {
    let chatUser
    beforeAll(commonBeforeAll);
    beforeEach(async() => {
        chatUser = new ChatUser(mockSend, 'testRoom');
        await chatUser.initializeRoom();
        commonBeforeEach
    });
    afterEach(() => {
        jest.clearAllMocks();
        commonAfterEach
    });
    afterAll(commonAfterAll); 

    /************************************** handleJoin */
    describe("gets Room object class instance", function () {
      test("should send member to room's member list", async function () {
        const room = await Room.get('testRoom');
        expect(room.members.size).toBe(0);
        await chatUser.handleJoin('u1', 'u2');
        expect(room.members.size).toBe(1);
      });
    });
});
  
