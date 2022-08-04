const { DB_TYPE_VARCHAR } = require('oracledb');
const oracledb = require('oracledb');
const fs = require("fs");
const { parse } = require("csv-parse"); //const csv  //destructiring



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


let records= [];
let headers= [];

fs.createReadStream("./targets.simple.csv")
  .pipe(parse({ delimiter: ",", from_line: 1, headers: true})) 
  .on("data", function (row) {
    records.push(row);
  })
  .on("end", async function () {
    let connection = await oracledb.getConnection({   
      user          : "EGITIM",
      password      : "EGITIM_1478.",
      connectString : "5.189.178.35:1521/datateamdb"
  });

  
  records[0].forEach(element => {
   
      headers.push(element);
  });

  records.shift(); //delete header from records
    
  await records.forEach(element => {  //await added.
  multipleEntry(connection,element,headers);
  });
  console.log("The operation has been completed successfully");

  })
  .on("error", function (error) {
    console.log(error.message);
  });


  


async function multipleEntry(connection,element,headers){


//   let sql = `INSERT INTO EGITIM.TARIK_MECR VALUES (:a, :b,
//     :c, :d, :e, :f, :g, :h, 
//     :i, :j, :k, :l, :m, :n,`;
//   sql = sql.substring(0, sql.length - 1);
//   console.log(sql);
//   sql+=")";
//  const binds = [
//   [element[0],element[1],element[2],element[3],element[4],element[5],element[6],element[7],
//   element[8], element[9],element[10],element[11],element[12],element[13]]
 
//  //{ a: '96', b: "Person", c:"Ömer", d:"omr", e:"19-12-1996",f:"tr",g:"qwerty",h:"zxcvb",i:"vbnm",j:"12345",k:"qwert@gmail.com",l:"qwert",m:"12-11-2000",n:"11-12-2001" },
//  //{ a: '97', b: "Person", c:"Faruk", d:"far", e:"19-12-1996",f:"tr",g:"qwerty",h:"zxcvb",i:"vbnm",j:"12345",k:"qwert@gmail.com",l:"qwert",m:"12-11-2000",n:"11-12-2001" },
//  ];

//  const options = {
//  autoCommit: true,
//  bindDefs: [
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },   
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//    { type: oracledb.STRING, maxSize: 700 },
//  ]
//  };
    

    let binds= [];
    let listInsideBinds=[]; //binds içinde bir liste daha olması gerek.(binds by position)
    binds.push(listInsideBinds);
    let sql = `INSERT INTO EGITIM.TARIK_MECR VALUES ( ` ;
    
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
    //console.log("The operation has been completed successfully");
    //console.log(result.rowsAffected);
    


}

//multipleEntry();







