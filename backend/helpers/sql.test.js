const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql")

describe("parameterizedQueries", function () {
    test("works with user data that contains all the fields", function () {
        const userData = {
            username:"test", 
            password:"test", 
            firstName:"test", 
            lastName:"test", 
            email:"test@email.com"
        }
        const jsToSql = {
            firstName: "first_name",
            lastName: "last_name",
        }
        const {setCols, values} = sqlForPartialUpdate(userData, jsToSql)
        expect(setCols).toEqual('"username"=$1, "password"=$2, "first_name"=$3, "last_name"=$4, "email"=$5')
        expect(values).toEqual(["test", "test", "test", "test", "test@email.com"])
    })


    test("works with user data that contains partial fields", function () {
        const userData = {
            password:"test", 
            firstName:"test", 
        }
        const jsToSql = {
            firstName: "first_name",
            lastName: "last_name",
        }
        const {setCols, values} = sqlForPartialUpdate(userData, jsToSql)
        expect(setCols).toEqual('"password"=$1, "first_name"=$2')
        expect(values).toEqual(["test", "test"])
    })

    test("test error when no user data", function () {
        const jsToSql = {
            firstName: "first_name",
            lastName: "last_name",
        }
        try {
            sqlForPartialUpdate({}, jsToSql)
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})