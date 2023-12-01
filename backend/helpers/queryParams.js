/**
 * Updates query parameters to fit Google Books protocols.
 * 
 * @param {object} dataToFilter - The data object to be filtered.
 * @param {object} qpToQp - The mapping of keys from the incoming data to the desired keys for the query parameters.
 * @returns {string} - A string with updated and joined data.
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

    // Build the query string with encoded parameters
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${encodeURIComponent(key)}:${encodeURIComponent(value)}`)
        .join('+');

    const termsUrl = queryString ? `+${queryString}` : '';

    return termsUrl;
}

module.exports = { queryParamsForPartialFilter };
