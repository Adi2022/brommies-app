const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors()); // Enable CORS middleware
require('dotenv').config(); // Load environment variables from .env file
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });
// Define the User schema
const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
	},
	lastname: {
		type: String,
	},
	username: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	confirmPassword: {
		type: String,
		required: true,
	},
});

// Define the User model
const User = mongoose.model("User", userSchema);

// Signup API
app.post("/signup", async (req, res) => {
	const { email, password,firstname,lastname,username,confirmPassword } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = await User.create({ email, password: hashedPassword, firstname,lastname,username,confirmPassword});
		res.status(201).json({ message: "Signup successful", user: newUser });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error from signup API" });
	}
});

// Login API
app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if the user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: "Authentication failed" });
		}

		// Compare passwords
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({ error: "Authentication failed" });
		}

		// Generate a JWT token
		const token = jwt.sign({ userId: user._id }, "secret-key", { expiresIn: "1h" });

		res.json({ message: "Login successful", token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error from login API" });
	}
});

// =================================== blog APIS =======================================================================

// Protect routes using middleware
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Authentication token missing" });
	}

	jwt.verify(token, "secret-key", (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid token" });
		}

		req.user = user;
		next();
	});
};

// Create a new blog
app.post("/data", authenticateToken, async (req, res) => {
	const { title, content } = req.body;

	try {
		const newBlog = await Blog.create({ title, content });
		res.status(201).json(newBlog);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error from create blog api" });
	}
});

// Delete a blog
app.delete("/data/:id", authenticateToken, async (req, res) => {
	const blogId = req.params.id;

	try {
		const deletedBlog = await Blog.findByIdAndDelete(blogId);

		if (!deletedBlog) {
			return res.status(404).json({ error: "Blog not found" });
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error from get blog api" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
