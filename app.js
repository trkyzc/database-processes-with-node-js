const { DB_TYPE_VARCHAR } = require('oracledb');
const oracledb = require('oracledb');
const fs = require("fs");
const { parse } = require("csv-parse"); //const csv  //destructiring
const csv = require('fast-csv')
var records= [];

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



fs.createReadStream('targets.simple.csv')
    .pipe(csv.parse({headers:true}))
    .on('error', error => console.error(error))
    .on('data', function(row){
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
  


async function multipleEntry(connection,element){

    // let connection = await oracledb.getConnection({   
    //     user          : "EGITIM",
    //     password      : "EGITIM_1478.",
    //     connectString : "5.189.178.35:1521/datateamdb"
    // });

    const sql = `INSERT INTO EGITIM.TARIK_MECR VALUES (:a, :b,
       :c, :d, :e, :f, :g, :h, 
       :i, :j, :k, :l, :m, :n)`;
    const binds = [
    { a: element[0], b: element[1], c: element[2], d: element[3], e: element[4],
      f: element[5],g: element[6],h: element[7],i: element[8],j: element[9],
      k: element[10],l: element[11],m: element[12],n: element[13]},
    //{ a: '96', b: "Person", c:"Ömer", d:"omr", e:"19-12-1996",f:"tr",g:"qwerty",h:"zxcvb",i:"vbnm",j:"12345",k:"qwert@gmail.com",l:"qwert",m:"12-11-2000",n:"11-12-2001" },
    //{ a: '97', b: "Person", c:"Faruk", d:"far", e:"19-12-1996",f:"tr",g:"qwerty",h:"zxcvb",i:"vbnm",j:"12345",k:"qwert@gmail.com",l:"qwert",m:"12-11-2000",n:"11-12-2001" },
    ];

    // for (let index = 0; index < element.length; index++) {
    //   let a = element[index];
    //   binds.push([a])
    // }

    const options = {
    autoCommit: true,
    bindDefs: {
      a: { type: oracledb.STRING, maxSize: 700 },
      b: { type: oracledb.STRING, maxSize: 700 },
      c: { type: oracledb.STRING, maxSize: 700 },
      d: { type: oracledb.STRING, maxSize: 700 },
      e: { type: oracledb.STRING, maxSize: 700 },
      f: { type: oracledb.STRING, maxSize: 700 },
      g: { type: oracledb.STRING, maxSize: 700 },
      h: { type: oracledb.STRING, maxSize: 700 },
      i: { type: oracledb.STRING, maxSize: 700 },   
      j: { type: oracledb.STRING, maxSize: 700 },
      k: { type: oracledb.STRING, maxSize: 700 },
      l: { type: oracledb.STRING, maxSize: 700 },
      m: { type: oracledb.STRING, maxSize: 700 },
      n: { type: oracledb.STRING, maxSize: 700 },
    }
    };

    const result = await connection.executeMany(sql, binds, options);

    //console.log(result.rowsAffected);
    //console.log("The operation has been completed successfully");


}

    
//multipleEntry();







