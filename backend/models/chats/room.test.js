const { Room, ROOMS } = require('./room');
const db = require("../../db.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../_testCommon.js");


describe("Room class", () => {
    beforeAll(commonBeforeAll);
    beforeEach(() => {
        ROOMS.clear();
        commonBeforeEach
    });
    afterEach(commonAfterEach);
    afterAll(commonAfterAll);
  
    /************************************** get */
    describe("gets Room object class instance", function () {
      test("should check if room exist updates date", async function () {
        expect(ROOMS.has('chatRoom1')).toBeFalsy();

        const room = await Room.get('chatRoom1');
        expect(ROOMS.has('chatRoom1')).toBeTruthy();
        expect(room).toBeInstanceOf(Room);

      });
  
      test("should check if room doesn't exist, creates new one", async function () {
        expect(ROOMS.has('chatRoomNew')).toBeFalsy();

        const room = await Room.get('chatRoomNew');
        expect(ROOMS.has('chatRoomNew')).toBeTruthy();
        expect(room).toBeInstanceOf(Room);
      });
    });

    /************************************** join */
    describe("join members update Room class instance", function () {
      test("should update instance members list, with non existing users", async function () {
        const room = await Room.get('chatRoom2');
        expect(room.members).toBeInstanceOf(Set);
        expect(room.members.size).toBe(0);
        await room.join({name:'u1', receiver:'u2'});
        expect(room.members.size).toBe(1);
      });

      test("should update instance members list, with existing users", async function () {
        const room = await Room.get('chatRoom1');
        expect(room.members).toBeInstanceOf(Set);
        expect(room.members.size).toBe(0);
        await room.join({name:'u1', receiver:'u2'});
        expect(room.members.size).toBe(1);
      });
    });
  
    /************************************** leave */
    describe("leave method delete members from Room class instance member list", function () {
        test("should update instance members list", async function () {
            const room = await Room.get('chatRoom2');
            await room.join({name:'u1', receiver:'u2'});
            expect(room.members.size).toBe(1);
            await room.leave([...room.members][0]);
            expect(room.members.size).toBe(0);
        });
    });
});
  
