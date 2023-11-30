const { BadRequestError } = require("../expressError");


/** Parameterizes dand jsonifies queries to provide security for setting new data into our database  * */ 
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Esma', lastName: 'Erdem'} => ['"first_name"=$1', '"last_name"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
//  setCols => '"first_name"=$1, "last_name"=$2'
//  values => ['Esma', 'Erdem']
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
