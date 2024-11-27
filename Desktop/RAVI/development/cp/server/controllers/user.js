import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/errorHandling.js";
import { Post } from "../models/post.js";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid User or Password", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid User or Password", 400));
    else {
      user.status = "online";
      await user.save();
      sendCookie(user, res, `Welcome back ${user.name}`, 200);
    }
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      image,
      programmingExperience,
      learnedTechnologies,
    } = req.body;

    let img = null;
    if (image != null) {
      img = image;
    }
    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User AllReady Exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: img,
      programmingExperience,
      learnedTechnologies,
    });
    console.log(user);
    sendCookie(user, res, "Registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const createNewposts = async (req, res) => {
  const { title, description, image, tof } = req.body;
  const userId = req.user.id; // Extracted from JWT or session

  try {
    // Determine the status based on whether the user is an admin
    const status = req.isAdmin ? "approved" : "pending";

    // Create a new post
    const newPost = await Post.create({
      title,
      description,
      image,
      tof,
      user: userId,
      status,
    });

    // Update the user's posts list by adding this new post
    const user = await User.findById(userId);
    if (user) {
      user.blogs.push(newPost._id);
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: req.isAdmin
        ? "New post created successfully and is approved!"
        : "New post created successfully and is pending approval!",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
  
export const getUserPosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getMyprofile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      user: req.user,
    });
};

export const feed = async (req, res, next) => {
  try {
    const approvedPosts = await Post.find({ status: 'approved' })
    .populate('user', 'name'); 
    res.status(200).json({ success: true, posts: approvedPosts });
  } catch (error) {
    console.error("Error fetching approved posts", error);
    res.status(500).json({ success: false, message: "Error fetching approved posts" });
  }
};



export const trend = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $sort: { likesCount: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          tof: 1, // Include the 'tof' field
          user: { $arrayElemAt: ["$user", 0] },
          likesCount: 1,
          commentsCount: { $size: "$comments" },
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
