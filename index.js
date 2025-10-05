const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis"); // <- important change
const { createClient } = require("redis");
const cors = require("cors");
const { Permission } = require("./constant");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
console.log(ORIGIN)
// Create Redis client
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

app.use(
  cors({
    origin: function(origin, callback){
    // allow requests with no origin like mobile apps or curl
    // console.log(origin, ORIGIN)
    // console.log(ORIGIN.indexOf(origin))
    if(!origin) return callback(null, true);
    if(ORIGIN.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`method ${req.method} url: ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/sign-up", (req, res) => {
  let { email, name, password, role = "user" } = req.body;
  if (!email || !name || !password) {
    res.status(404).json({
      message: "All field are mandatory",
    });
  }
  if (name == "admin") {
    role = "admin";
  }
  req.session.user = {
    email,
    name,
    password,
    role,
    permission: (role = "admin"
      ? [Permission?.VIEW_PAGE_1, Permission?.VIEW_PAGE_2]
      : [Permission?.VIEW_PAGE_1]),
  };

  res.status(200).json({
    message: "User Signup and session stored in Redis!",
  });
});

app.post("/login", (req, res) => {
  let { email, password, role = "user" } = req.body;
  let sessionInfo = req.session?.user;
  console.log(sessionInfo);
  if (sessionInfo?.password == password && sessionInfo?.email == email) {
    res.status(200).json({
      data: {
        ...sessionInfo,
      },
      message: "User logged in and session stored in Redis!",
    });
  } else {
    res.status(404).json({
      message: "User Not found",
    });
  }
});

app.get("/me", (req, res) => {
  let sessionInfo = req.session?.user;
  if (!sessionInfo?.role) {
    return res.status(401).json({ error: "Not authenticated" });
  } else {
    return res.status(200).json({
      data: {
        ...sessionInfo,
      },
    });
  }
});

app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.send(`Hello ${req.session.user.name}, role: ${req.session.user.role}`);
  } else {
    res.status(401).send("No session found, please login.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Error logging out");
    res.status(200).json({
      message: "Logged out successfully",
    });
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
