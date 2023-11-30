const { BadRequestError } = require("../expressError");

/**
 * Updates query parameters to fit Google Books protocols.
 * 
 * @param {object} dataToFilter - The data object to be filtered.
 * @param {object} qpToQp - The mapping of keys from the incoming data to the desired keys for the query parameters.
 * @returns {object} - An object with updated keys based on the specified mapping.
 * @throws {BadRequestError} - Throws an error if the incoming data object is empty.
 */
function queryParamsForPartialFilter(dataToFilter, qpToQp) {
    const keys = Object.keys(dataToFilter);

    // Transform keys based on the specified mapping
    // { title: "The Great Gatsby", author: "F. Scott Fitzgerald" } =>  { intitle: "The Great Gatsby", inauthor: "F. Scott Fitzgerald" }
    const queryParams = {};
    keys.forEach((queryParam) => {
        const updatedKey = qpToQp[queryParam] || queryParam;
        queryParams[updatedKey] = dataToFilter[queryParam];
    });

    return queryParams;
}

module.exports = { queryParamsForPartialFilter };
