// USE THIS ONLY FOR DEVELOPMENT until Auth is finished
export const mockTutee = (req, res, next) => {
  req.user = { 
    _id: "64f1b2c3e4b0a1a2b3c4d5e6", // Fake MongoID
    name: "Mock Tutee",
    role: "tutee",
    email: "tutee@up.edu.ph"
  };
  next();
};

export const mockAdmin = (req, res, next) => {
  req.user = { 
    _id: "99f1b2c3e4b0a1a2b3c4d999", 
    name: "Mock Admin",
    role: "admin",
    isLRCAdmin: true
  };
  next();
};