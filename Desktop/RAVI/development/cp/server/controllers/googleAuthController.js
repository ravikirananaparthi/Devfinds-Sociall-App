// controllers/googleAuthController.js

import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";

export const googleRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      programmingExperience,
      learnedTechnologies,
      token,
    } = req.body;
    console.log(req.body);
    let img = image || null;

    // Verify ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);

    // Check for existing user with the same email
    let user = await User.findOne({ email }).select("socialauth");
    console.log(user);
    if (user) {
      if (!user.socialauth) {
        return res.status(403).json({
          error: "This email is signed up without Google (Login with Email and password)",
        });
      }
      return res.json({ message: "User already exists with Google sign-in" });
    }

    user = new User({
      name,
      email,
      password,
      image: img,
      programmingExperience,
      learnedTechnologies,
      socialauth: true,
    });
    await user.save();
    const tokeen = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2 days",
    });

    res.json({ success: true, message: "Registered successfully", tokeen });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/invalid-token") {
      return res.status(401).json({ error: "Invalid Google sign-in token" });
    } else {
      return res.status(500).json({ error: "An error occurred during registration" });
    }
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);

    const user = await User.findOne({ email: decodedToken.email }).select("socialauth");
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    if (!user.socialauth) {
      return res.status(403).json({
        error: "This email is signed up without Google (Login with Email and password)",
      });
    }

    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2 days",
    });

    res.json({
      success: true,
      message: "Logged in successfully",
      token: jwtToken,
    });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/invalid-token") {
      return res.status(401).json({ error: "Invalid Google sign-in token" });
    } else {
      return res.status(500).json({ error: "An error occurred during login" });
    }
  }
};
