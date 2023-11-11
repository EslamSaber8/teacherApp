const cloudinary = require("../config/cloudinary")

exports.uploadIMG = async (req, res, next) => {
    console.log(req.file)
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "teacherApp/",
        })
        console.log(result)
        req.body.profileImg = result.secure_url;
    }
    next()
}
exports.uploadVideo = async (req, res, next) => {
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "video", folder: "teacherAPP/" })
        req.body.video = result.secure_url
    }
    next()
}