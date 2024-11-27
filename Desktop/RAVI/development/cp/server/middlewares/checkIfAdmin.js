// middlewares/checkAdmin.js
export const checkIfAdmin = (req, res, next) => {
    try {
      const user = req.user; // Assuming user information is already extracted by `isAuthenticated`
  
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      // If the user is an admin, set a flag in the request
      req.isAdmin = user.role === "admin";
      next();
    } catch (error) {
      console.error("Error in checkIfAdmin middleware:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  