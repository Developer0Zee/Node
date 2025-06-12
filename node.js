
//exporting express
import express from "express";

//creating an app instance using express
const app = express();

//middleware to parse data from body in json format
app.use(express.json());

// middle to show method status code and url
app.use((req, res, next) => {
  res.on("finish",()=>{
    console.log(`${req.method} ${req.url}-${req.statusCode}`);
  })
  next();
});

//storing data using local array 
let userData = [
  {
    id: "1",
    firstName: "Anshika",
    lastName: "Agarwal",
    hobby: "Teaching",
  },
  {
    id: "2",
    firstName: "Zeeshan",
    lastName: "Ahmad",
    hobby: "Coding",
  },
  {
    id: "3",
    firstName: "Sonia",
    lastName: "Malik",
    hobby: "teaching",
  },
];
// another middleware to validate the inputs by user
const validate = (req, res, next) => {
  const { firstName, lastName, hobby } = req.body;

  if (
     !firstName  ||
    !lastName  ||
    !hobby 
  ) {
    return res.status(400).send("Please enter all values in strings");
  }
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof hobby !== "string"
  ) {
    return res.status(400).send("All fields must be of type string.");
  }
  next();
};

// api to get all users
app.get("/users", (req, res) => {
  res.send(userData);
});

// api to get specific user
app.get("/users/:id", (req, res) => {
  const userID = req.params.id;

  const user = userData.find((user) => user.id == userID);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).send(user);
});

//adding new user and sharing it to server using post
app.post("/user", validate, (req, res) => {
  const { id, firstName, lastName, hobby } = req.body;

  const newUser = {
    id: Math.floor(Math.random() * 1000).toString(),
    firstName: firstName,
    lastName: lastName,
    hobby: hobby,
  };
  userData.push(newUser);

  res.status(201).send(userData);
});

// updating the existing user using post
app.put("/user/:id", validate, (req, res) => {
  const userID = req.params.id;

  if (Object.keys(req.body).length === 0) {
    return res.status(404).json({ message: "No feilds to update" });
  }

  const editUser = userData.find((user) => user.id == userID);

  if (!editUser) {
    return res.status(404).json({ message: "user not found" });
  }

  const keys = Object.keys(req.body);

  keys.forEach((key) => {
    editUser[key] = req.body[key];
  });

  res.send(userData);
});

// deleting user using delete method
app.delete("/user/:id", (req, res) => {
  const userID = req.params.id;
  const initialLength = userData.length;

  userData = userData.filter((user) => user.id != userID);

  if (userData.length === initialLength) {
    return res.status(404).json({ message: "User not found" });
  }

  res.send({ message: "User deleted ", users: userData });
});
app.listen(3000, () => {
  console.log("server is running");
});
