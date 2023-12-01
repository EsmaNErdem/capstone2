const { queryParamsForPartialFilter } = require("./queryParams");

describe("Updates query parameters", function () {
    test("works with query parameters that contains all the fields", function () {
        const dataToFilter = {
            title:"test", 
            author:"test", 
            publisher:"test", 
            subject:"test"
        }
        const qpToQp = {
            title: "intitle",
            author: "inauthor", 
            publisher: "inpublisher",
        }
        const termsUrl = queryParamsForPartialFilter(dataToFilter, qpToQp)
        expect(termsUrl).toEqual('+intitle:test+inauthor:test+inpublisher:test+subject:test')
    })

    test("works with query parameters that contains partial fields", function () {
        const dataToFilter = {
            title:"test", 
            subject:"test"
        }
        const qpToQp = {
            title: "intitle",
            author: "inauthor", 
            publisher: "inpublisher",
        }
        const termsUrl = queryParamsForPartialFilter(dataToFilter, qpToQp)
        expect(termsUrl).toEqual('+intitle:test+subject:test')
    })

    test("return empty string when no query parameters", function () {
        const dataToFilter = {};
        const qpToQp = {
            title: "intitle",
            author: "inauthor", 
            publisher: "inpublisher",
        }
        const termsUrl = queryParamsForPartialFilter(dataToFilter, qpToQp)
        expect(termsUrl).toEqual('')
    })
})
