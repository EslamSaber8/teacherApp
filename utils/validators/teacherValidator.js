const bcrypt = require("bcryptjs")
const { check, body } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const Teacher = require("../../models/teacherModel")

exports.createTeacherValidator = [
    check("fullName")
        .notEmpty()
        .withMessage("teacher name  required")
        .isLength({ min: 6 })
        .withMessage("Too short fullName")
        .isLength({ max: 32 })
        .withMessage("Too long fullName"),

    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            Teacher.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("E-mail already in user"))
                }
            })
        ),
    check("subject").notEmpty().withMessage("subject required"),

    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error("Password Confirmation incorrect")
            }
            return true
        }),

    check("passwordConfirm").notEmpty().withMessage("Password confirmation required"),

    check("profileImg").optional(),
    check("role").optional(),
    check("classes").optional(),
    check("level")
        .notEmpty()
        .withMessage("teacher level required")
        .isNumeric()
        .withMessage("level must be a number between 1 and 12")
        .custom((value) => {
            if (value < 1 || value > 12) {
                throw new Error("level must be between 1 and 12")
            }
            return true
        }),

    validatorMiddleware,
]

exports.getTeacherValidator = [check("id").isMongoId().withMessage("Invalid teacher id format"), validatorMiddleware]

exports.updateTeacherValidator = [
    check("id").isMongoId().withMessage("Invalid teacher  id format"),
    body("fullName").optional().isLength({ min: 6 }).withMessage("Too short fullName").isLength({ max: 32 }).withMessage("Too long fullName"),
    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            Teacher.findOne({ email: val }).then((teacher) => {
                if (teacher) {
                    return Promise.reject(new Error("E-mail already in teacher"))
                }
            })
        ),

    check("profileImg").optional(),
    check("subject").optional(),
    check("role").optional(),
    check("classes").optional(),
    check("level")
        .optional()
        .isNumeric()
        .withMessage("level must be a number between 1 and 12")
        .custom((value) => {
            if (value < 1 || value > 12) {
                throw new Error("level must be between 1 and 12")
            }
            return true
        }),

    validatorMiddleware,
]

exports.changeTeacherPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid Teacher id format"),
    body("currentPassword").notEmpty().withMessage("You must enter your current password"),
    body("passwordConfirm").notEmpty().withMessage("You must enter the password confirm"),
    body("password")
        .notEmpty()
        .withMessage("You must enter new password")
        .custom(async (val, { req }) => {
            // 1) Verify current password
            const teacher = await Teacher.findById(req.params.id)
            if (!teacher) {
                throw new Error("There is no teacher for this id")
            }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, teacher.password)
            if (!isCorrectPassword) {
                throw new Error("Incorrect current password")
            }

            // 2) Verify password confirm
            if (val !== req.body.passwordConfirm) {
                throw new Error("Password Confirmation incorrect")
            }
            return true
        }),
    validatorMiddleware,
]

exports.deleteTeacherValidator = [check("id").isMongoId().withMessage("Invalid teacher id format"), validatorMiddleware]

exports.updateLoggedTeacherValidator = [
    body("fullName").optional().isLength({ min: 6 }).withMessage("Too short fullName").isLength({ max: 32 }).withMessage("Too long fullName"),

    check("email").optional()
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            Teacher.findOne({ email: val }).then((teacher) => {
                if (teacher) {
                    return Promise.reject(new Error("E-mail already in user"))
                }
            })
        ),
    check("profileImg").optional(),
    check("subject").optional(),
    check("classes").optional(),
    check("level")
        .optional()
        .isNumeric()
        .withMessage("level must be a number between 6 and 25")
        .custom((value) => {
            if (value < 1 || value > 12) {
                throw new Error("level must be between 1 and 12")
            }
            return true
        }),

    validatorMiddleware,
]
