const { DB_TYPE_VARCHAR } = require('oracledb');
const oracledb = require('oracledb');

// async function selectValues(){
//     try{
//         const connection = await oracledb.getConnection({   
//             user          : "EGITIM",
//             password      : "EGITIM_1478.",
//             connectString : "5.189.178.35:1521/datateamdb"
//         });
//         console.log("Connected Succesfully")

//         //SELECT
//         //const result = await connection.execute('SELECT * FROM TARIK_MECR');
//         //console.log('result',result.rows)
//         //console.log(typeof result.rows);

//         //INSERT
//         //let result= await connection.execute(` INSERT INTO EGITIM.TARIK_MECR("name","schema") VALUES('Tarık','Person') `);
//         //console.log(result.rowsAffected);
//         //connection.commit();

//         //DELETE
//         // let result= await connection.execute(` DELETE FROM EGITIM.TARIK_MECR WHERE "name" = 'ÖMER' `);
//         // console.log(result.rowsAffected);
//         // connection.commit();

//         //UPDATE
//         // let result = await connection.execute(`UPDATE EGITIM.TARIK_MECR SET "name"='Ömer' WHERE "phones" = '553' `) ; 
//         // console.log(result.rowsAffected);
//         // connection.commit();


//         //SELECT TOP
//         // let result = await connection.execute(`SELECT *
//         // FROM EGITIM.TARIK_MECR
//         // ORDER BY "countries"
//         // FETCH FIRST 10 ROWS ONLY`)
//         // console.log(result.rows);
//         // connection.commit();

//         //SELECT DISTINCT
//         // let result = connection.execute(`SELECT DISTINCT "countries"
//         // FROM EGITIM.TARIK_MECR`)
//         // console.log(result.rowsAffected);
//         // connection.commit();
       
        
//     }
//     catch(e){
//         console.log('exception',e)
//     }

// }

// selectValues();

const fs = require("fs");
const { parse } = require("csv-parse"); //const csv  //destructiring
var records= [];

fs.createReadStream("./targets.simple.csv")


  .pipe(parse({ delimiter: ",", from_line: 2 })) 
  .on("data", function (row) {
    records.push(row);
  })
  .on("end", async function () {
    let connection = await oracledb.getConnection({   
      user          : "EGITIM",
      password      : "EGITIM_1478.",
      connectString : "5.189.178.35:1521/datateamdb"
  });

    await records.forEach(element => {  //await eklendi.
      multipleEntry(connection,element);
    });
    console.log("The operation has been completed successfully");
  })
  .on("error", function (error) {
    console.log(error.message);
  });

  



async function multipleEntry(connection,element){

    const sql = `INSERT INTO EGITIM.TARIK_MECR VALUES (:id, :schema,
       :name, :aliases, :birth_date, :countries, :addresses, :identifiers, 
       :sanctions, :phones, :emails, :dataset, :first_seen, :last_seen)`;
    const binds = [
    { id: element[0], schema: element[1], name: element[2], aliases: element[3], birth_date: element[4],
      countries: element[5],addresses: element[6],identifiers: element[7],sanctions: element[8],phones: element[9],
      emails: element[10],dataset: element[11],first_seen: element[12],last_seen: element[13] },
    //{ a: '96', b: "Person", c:"Ömer", d:"omr", e:"19-12-1996",f:"tr",g:"qwerty",h:"zxcvb",i:"vbnm",j:"12345",k:"qwert@gmail.com",l:"qwert",m:"12-11-2000",n:"11-12-2001" },
    //{ a: '97', b: "Person", c:"Faruk", d:"far", e:"19-12-1996",f:"tr",g:"qwerty",h:"zxcvb",i:"vbnm",j:"12345",k:"qwert@gmail.com",l:"qwert",m:"12-11-2000",n:"11-12-2001" },
    ];

    const options = {
    autoCommit: true,
    bindDefs: {
      id: { type: oracledb.STRING, maxSize: 700 },
      schema: { type: oracledb.STRING, maxSize: 700 },
      name: { type: oracledb.STRING, maxSize: 700 },
      aliases: { type: oracledb.STRING, maxSize: 700 },
      birth_date: { type: oracledb.STRING, maxSize: 700 },
      countries: { type: oracledb.STRING, maxSize: 700 },
      addresses: { type: oracledb.STRING, maxSize: 700 },
      identifiers: { type: oracledb.STRING, maxSize: 700 },
      sanctions: { type: oracledb.STRING, maxSize: 700 },   
      phones: { type: oracledb.STRING, maxSize: 700 },
      emails: { type: oracledb.STRING, maxSize: 700 },
      dataset: { type: oracledb.STRING, maxSize: 700 },
      first_seen: { type: oracledb.STRING, maxSize: 700 },
      last_seen: { type: oracledb.STRING, maxSize: 700 },
    }
    };

    const result = await connection.executeMany(sql, binds, options);

    //console.log(result.rowsAffected);
    //console.log("The operation has been completed successfully");


}

    
//multipleEntry();







