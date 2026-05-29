import mysql from 'mysql2/promise';


// const connectDB = async () => {
//   try {

//     const connection = await mysql.createConnection({
//       host: process.env.MYSQL_HOST,
//       user: process.env.MYSQL_USER,
//       password: process.env.MYSQL_PASSWORD,
//       database: 'ticketapp',
//       
//     });

//     console.log("Database Connected");

//     return connection;

//   } catch (error) {
//     console.error(error.message);
//   }
// }

// export default connectDB;



const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "ticketapp",
    waitForConnections: true,
    connectionLimit: 10
});

console.log("Database Connected");

export default pool;