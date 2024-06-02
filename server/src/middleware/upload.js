const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        if (file) {
          const size = req.headers["content-length"] / 1024 / 1024;
          if (
            size < 1 &&
            (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png")
          ) {
            cb(null, path.join(__dirname,"../../photos/"));
          } else {
            cb(null, "false");
          }
        }
      },
      filename: function (req, file, cb) {
        if (file) {
          const date = Date.now();
          const filename = file.originalname.split(".")[0] + "_" + date + ".jpg";
          cb(null, filename);
        } else {
          cb(null, "false");
        }
      },
    }),
  }).single("image");

  module.exports = upload;