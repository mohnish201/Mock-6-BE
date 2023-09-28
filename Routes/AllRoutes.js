const express = require("express");
const { UserModel } = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlogModel } = require("../Models/BlogModel");
const { auth } = require("../MiddleWare/auth");

const AllRoutes = express.Router();

//register route
AllRoutes.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    res.send("Already have Account");
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send(err);
        } else {
          const newUser = new UserModel({ ...req.body, password: hash });
          await newUser.save();
          res.send({ msg: "Registered Successfully", newUser });
        }
      });
    } catch (error) {
      res.send(error);
    }
  }
});

//login route
AllRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    try {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, user: user.username },
            "masai"
          );
          res.send({ msg: "Login Successfull", token });
        } else {
          res.send("Wrong Credentials");
        }
      });
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("Wrong Credentials");
  }
});

//blog post route
AllRoutes.post("/blogs", auth, async (req, res) => {
  try {
    const NewBlog = new BlogModel(req.body);
    await NewBlog.save();
    res.send("Blog Created and Uploaded");
  } catch (error) {
    res.send(error);
  }
});

//blog patch route

AllRoutes.patch("/blogs/:blog_id", auth, async (req, res) => {
  const { blog_id } = req.params;

  const blog = await BlogModel.find({ _id: blog_id, userId: req.body.userId });
  console.log(blog);
  if (!blog) {
    res.send("You are not authorized");
  } else {
    await BlogModel.findByIdAndUpdate({ _id: blog_id }, req.body);
    res.send("Blog updated");
  }
});

//blog delete route

AllRoutes.delete("/blogs/:blog_id", auth, async (req, res) => {
  const { blog_id } = req.params;

  const blog = await BlogModel.find({ _id: blog_id, userId: req.body.userId });
  console.log(blog);
  if (!blog) {
    res.send("You are not authorized");
  } else {
    await BlogModel.findByIdAndDelete({ _id: blog_id });
    res.send("Blog deleted");
  }
});

//blog get Route

AllRoutes.get("/blogs", auth, async (req, res) => {
  const { q, category, sort, order } = req.query;

  const query = {};

  if (q) {
    query.title = { $regex: q, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  const sortedArray = order == "asc" ? 1 : -1;

  try {
    const blogs = await BlogModel.find({
      ...query,
      userId: req.body.userId,
    }).sort({ date: sortedArray });

    if (blogs) {
      res.send(blogs);
    } else {
      res.send("No blogs are present");
    }
  } catch (error) {
    res.send(error);
  }
});

//blog likes route
// AllRoutes.patch("/blogs/:blog_id/like", auth, async (req, res) => {
//   const { blog_id } = req.params;

//   const blog = await BlogModel.find({ _id: blog_id, userId: req.body.userId });
//   const likes = blog.likes;
//   console.log(blog);
//   if (!blog) {
//     res.send("You are not authorized");
//   } else {
//     await BlogModel.findByIdAndUpdate({ _id: blog_id }, { likes: likes + 1 });
//     res.send("Blog liked");
//   }
// });

// //blog comment route
// AllRoutes.patch("/blogs/:blog_id/comment", auth, async (req, res) => {
//   const { blog_id } = req.params;

//   const blog = await BlogModel.find({ _id: blog_id, userId: req.body.userId });
//   console.log(typeof blog);
//   // console.log(blog);
//   if (!blog) {
//     res.send("You are not authorized");
//   } else {
//     await BlogModel.findByIdAndUpdate({ _id: blog_id }, req, body);
//     res.send("Blog commented");
//   }
// });

module.exports = {
  AllRoutes,
};
