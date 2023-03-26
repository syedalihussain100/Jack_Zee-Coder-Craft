const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

//storage
const multerStorage = multer.memoryStorage();

// file type checking


const multerFilter = (req, file, cb) => {
    //check file type
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      //rejected files
      cb(
        {
          message: "Unsupported file format",
        },
        false
      );
    }
  };
  
  const profilePhotoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
  });
  
  //  Profile Image Resizing
  
  const profilePhotoResize = async (req, res, next) => {
    // check if there is no file
    if (!req.file) return next();
  
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  
    await sharp(req.file.buffer)
      .resize(250, 250)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(`public/images/profile/${req.file.filename}`));
  
    next();
  };

  // organization

  const organizationPhotoResize = async (req,res,next) =>{
     // check if there is no file
     if (!req.file) return next();
  
     req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
   
     await sharp(req.file.buffer)
       .resize(250, 250)
       .toFormat("jpeg")
       .jpeg({ quality: 90 })
       .toFile(path.join(`public/images/organization/${req.file.filename}`));
   
     next();
  }
  

module.exports = { profilePhotoUpload, profilePhotoResize,organizationPhotoResize };
