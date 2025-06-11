import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.on("finish",()=>{
    console.log(`${req.method} ${req.url}-${req.statusCode}`);
  })
  next();
});

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

const validate = (req, res, next) => {
  const { firstName, lastName, hobby } = req.body;

  if (
    typeof firstName != "string" ||
    lastName != "string" ||
    hobby != "string"
  ) {
    return res.status(400).send("Please enter values in strings");
  }
  next();
};

app.get("/users", (req, res) => {
  res.send(userData);
});

app.get("/users/:id", (req, res) => {
  const userID = req.params.id;

  const user = userData.find((user) => user.id == userID);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).send(user);
});

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

app.put("/user/:id", validate, (req, res) => {
  const userID = req.params.id;

  if (Object.keys(req.body).length === 0) {
    return res.status(404).json({ message: "No fiels to update" });
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
