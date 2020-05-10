const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const app = express();
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// routes
app.use('/api/auth', require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/challenge", require("./routes/api/challenge"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/buddy", require("./routes/api/buddy"));

app.use("/api/dare", require("./routes/api/dare"));
app.use("/api/_auth", require("./routes/api/_auth"));
app.use("/api/admin", require("./routes/api/admin"));

// In production environment
if (process.env.NODE_ENV === "production") {
  // Define client/build as the static folder
  app.use(express.static("client/build"));

  // Make a request to any thing except the api route, it's going to load thte index.html file
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(' Starting the engine (Wait until the server starts and MongoDB connects) '.bgYellow.black.bold);
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
