import express from "express";
import bodyParser from "body-parser";
import MOCK_DATA from "./MOCK_DATA.json" assert { type: "json" };
import fs from "fs";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

const app = express();
dotenv.config(); // to activate the env

const PORT = process.env.PORT || 3000;

//use of bodyparser middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//rate limiter..
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

app.use(limiter);

//creating middleware for cheking api key..

//api key is used for security it basically means that before doing any http method like post,put,patch,delete you will need a api key which you have decided in .env.So for checking we create a middleware in which we get api in query so we fetch it from process.env.apikey.
function middlewareapikey(req, res, next) {
  const apikey = process.env.apikey;
  const key = req.query.api;

  if (!key) {
    return res.status(400).json({ error: "enter key before that no access" });
  }
  if (key !== apikey) {
    return res.status(400).json({ error: "wrong api key entered" });
  }
  next();
}

//routes

//Creating your own query string....
app.get("/api/users", (req, res) => {
  const gender = req.query.gender;
  const job_title = req.query.job;
  //giving default page and limit while destructing
  const { limit = 10, page = 1 } = req.query;

  const filterData = MOCK_DATA.filter((user) => {
    if (gender && job_title) {
      return gender === user.gender && job_title === user.job_title;
    } else if (gender) {
      return gender === user.gender;
    } else if (job_title) {
      return job_title === user.job_title;
    } else {
      return true;
    }
  });
  //
  if (filterData.length === 0) {
    return res.status(400).json({ error: "Query Not Found" });
  }

  //pagination

  const startIndex = (page - 1) * limit;
  const paginateUser = filterData.slice(startIndex, startIndex + Number(limit));

  // Simple response
  res.json({
    status: 200,
    page: Number(page),
    limit: Number(limit),
    data: paginateUser,
  });
  console.log("testing query");
});

//getting only firstname from a specific route
app.get("/users", (req, res) => {
  const html = `
    <ol>

     ${MOCK_DATA.map((user) => {
       return `<li>${user.first_name}</li>`;
     }).join("")}

    
    </ol>`;
  res.send(html);
});

//to get value by id....DYNAMIC ROUTE WE GET ID BY {REQ.PARAMS.id}
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = MOCK_DATA.find((user) => {
    return user.id === id;
  });
  res.json(user);
});

//post route..to add something by user

app.post("/api/users", middlewareapikey, (req, res) => {
  //TODO: add new user to array
  const newData = req.body;

  if (!newData || Object.keys(newData).length === 0) {
    return res.status(400).json("No data submitted");
  }

  MOCK_DATA.push({ id: MOCK_DATA.length + 1, ...newData });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(MOCK_DATA), (err, data) => {
    if (err) {
      throw err;
    }
  });
  res.json("user created successfully");
});

//put request..
app.put("/api/users/:id", middlewareapikey, (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;

  const putData = MOCK_DATA.findIndex((user) => {
    return user.id === id;
  });
  if (putData === -1) {
    res.status(404).json({ error: "id not matched" });
  }
  const updateUp = { ...MOCK_DATA[putData], ...data };
  MOCK_DATA[putData] = updateUp;
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(MOCK_DATA), (err, data) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ error: "User Updated successfully..." });
  });
});

// //patch request..
app.patch("/api/users/:id", middlewareapikey, (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  const triggeredUser = MOCK_DATA.findIndex((user) => {
    return user.id === id;
  });

  if (triggeredUser === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  const updatedUser = { ...MOCK_DATA[triggeredUser], ...body };

  MOCK_DATA[triggeredUser] = updatedUser;
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(MOCK_DATA), (err, data) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ message: "updated user" });
  });
});

//delete user

app.delete("/api/users/:id", middlewareapikey, (req, res) => {
  const id = Number(req.params.id);

  const delIndex = MOCK_DATA.findIndex((user) => {
    return user.id === id;
  });
  if (delIndex === -1) {
    return res.status(404).json({ message: "index not found" });
  }
  MOCK_DATA.splice(delIndex, 1, 0);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(MOCK_DATA), (err, data) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ message: "deleted user" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
//donee...
