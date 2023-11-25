// Aquí estan los models y las routes
const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secretkey = "ultrasecretkey";

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "mybase",
    connectionLimit: 5,
  });

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

//Controllers

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username }, secretkey);
    res.json({ token });
  } else {
    res.status(401).json({ message: "Credenciales incorrectas" });
  }
});

app.use("/listaComentarios", async (req, res, next) => {
  try{
    const decoded = jwt.verify(req.headers["access-token"], secretkey);
    console.log(decoded);
    next();
  }catch (err){
    res.status(401).json({ message:"usuario no autorizado" });
  }
});

//Obtiene los comentarios de la base de datos
app.get("/listaComentarios", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT id, name, comment_text, created_at FROM comentarios"
      );
  
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Server not responding" });
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });

  //Crea un nuevo comentario en la base de datos
  app.post("/agregarComentario", async (req, res) => {
    let conn;
    const { name, comment_text } = req.body;

    try {
      conn = await pool.getConnection();
      const response = await conn.query(
        `INSERT INTO comentarios(name, comment_text, created_at) VALUES (?, ?, ?)`,
        [req.body.name, req.body.comment_text, req.body.created_at]
      );
  
      res.json({ id: parseInt(response.insertId), ...req.body });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server not responding" });
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });