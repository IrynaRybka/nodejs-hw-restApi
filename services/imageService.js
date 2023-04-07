const path = require('path');
const fse = require('fs-extra');
const sharp = require('sharp');
const multer = require('multer');
const uuid = require('uuid').v4;

class ImageService {
  static upload(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, callBackFunc) => {
      if (file.mimetype.startsWith('image')) {
        callBackFunc(null, true);
      } else {
        const error = new Error('Please upload images only');
        error.status = 401;
        callBackFunc((error.status, error), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, options, ...pathSegments) {
    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

    await fse.ensureDir(fullFilePath);
    await sharp(file.buffer)
      .resize(options || { height: 250, width: 250 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
