const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbconnect");
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const postsRoute = require("./routes/postsRoute");
const categoryRoute = require("./routes/categoryRoute");
const multer = require("multer");
const path = require("path")
const cors = require('cors')

//rest obj:
const app = express();

//middlewares:
app.use(express.json());
app.use(cors())

app.use("/images", express.static(path.join(__dirname, "/images")))

//config env file:
dotenv.config();

//MongoDB connect:
connectDB();

//MULTER disk storage:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file has been uploaded");
});

//routes:
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoryRoute);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


//static file:
app.use(express.static(path.join(__dirname, "./client/build")));
// serve index.html for any other requests
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "client", "build", "index.html"),
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: Unable to serve index.html");
      }
    }
  );
});

//PORT:
const PORT = process.env.PORT || 8080;

//listen:
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT} `.bgCyan);
});
