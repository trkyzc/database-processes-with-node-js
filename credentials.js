const oracledb = require('oracledb');

module.exports = async function connect() { 

    var connection= await oracledb.getConnection({   
        user          : "EGITIM",
        password      : "EGITIM_1478.",
        connectString : "5.189.178.35:1521/datateamdb"
    })
}

