const { DB_TYPE_VARCHAR } = require('oracledb');
const oracledb = require('oracledb');
const fs = require("fs");
const { parse } = require("csv-parse"); //const csv  //destructiring
const download = require('download');
const pathh = require('path');
//const connect= require("./credentials.js")


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




var records= [];
var headers= [];
//var csvName= `targetssimple` //targets.simple şeklinde yazınca hata veriyor.Tek kelime olacak.
var csvName;


async function downloadCSV() {
    const file = 'https://data.opensanctions.org/datasets/latest/eu_cor_members/targets.simple.csv';
    var name=(pathh.basename(file));
    csvName=name.replace('.' ,'');
    csvName=csvName.replace('.csv','');
    console.log(csvName);

    const filePath = `${__dirname}/`;
      
    await download(file,filePath)
    .then(() => {
        console.log('Download Completed');
    })   

    fs.rename(name, `${csvName}.csv`, function (err) {
      if (err) throw err;
      console.log('File Renamed.');                                            
    });

}


//downloadCSV();

                              
async function run() {
  await downloadCSV();

  fs.createReadStream(`./${csvName}.csv`) 
  .pipe(parse({ delimiter: ",", from_line: 1, headers: true})) 
  .on("data", function (row) {
    records.push(row);
  })
  .on("end", async function () {
    
     //var connection= connect().connection;

    var connection= await oracledb.getConnection({   
      user          : "EGITIM",
      password      : "EGITIM_1478.",
      connectString : "5.189.178.35:1521/datateamdb"
  })

  
      records[0].forEach(element => {
      
          headers.push(element);
      });


      records.shift(); //delete header from records
      createTable(connection,headers);
        
      await records.forEach(element => {  //await added.
      multipleEntry(connection,element,headers);
      });
      console.log("The operation has been completed successfully");
      })

  .on("error", function (error) { 
    console.log(error.message);
  });

}

run();

// fs.createReadStream(path) 
//   .pipe(parse({ delimiter: ",", from_line: 1, headers: true})) 
//   .on("data", function (row) {
//     records.push(row);
//   })
//   .on("end", async function () {
    
//      //var connection= connect().connection;

//     var connection= await oracledb.getConnection({   
//       user          : "EGITIM",
//       password      : "EGITIM_1478.",
//       connectString : "5.189.178.35:1521/datateamdb"
//   })

  
//       records[0].forEach(element => {
      
//           headers.push(element);
//       });


//       records.shift(); //delete header from records
//       createTable(connection,headers);
        
//       await records.forEach(element => {  //await added.
//       multipleEntry(connection,element,headers);
//       });
//       console.log("The operation has been completed successfully");
//       })

//   .on("error", function (error) { 
//     console.log(error.message);
//   });






async function createTable(connection,headers){
  //console.log(csvName);
  var sqlCreateTable = `CREATE TABLE ${csvName}(`

  for (let i = 0; i < headers.length; i++) {
    sqlCreateTable += `${headers[i]} VARCHAR(2000),` 
  }
  sqlCreateTable = sqlCreateTable.substring(0, sqlCreateTable.length - 1);
  sqlCreateTable += `)`;
  await connection.execute(sqlCreateTable);
  console.log("Table has been created successfully");

}



async function multipleEntry(connection,element,headers){ 

    let binds= [];
    let listInsideBinds=[]; //binds içinde bir liste daha olması gerek.(binds by position)
    binds.push(listInsideBinds);
    let sql = `INSERT INTO EGITIM.${csvName} VALUES ( ` ; 
    
    for (let index = 0; index < headers.length; index++) {
      sql+=":" + headers[index] + ","
      
      listInsideBinds.push(element[index])
    }
    sql = sql.substring(0, sql.length - 1);
    sql += ")" ;



    const options = {
      autoCommit: true  

    // bindDefs: [ //optional but more faster.
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },   
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    //   { type: oracledb.STRING, maxSize: 200 },
    // ]
    };


    const result = await connection.executeMany(sql, binds, options);
    //console.log(result.rowsAffected);
    


}




