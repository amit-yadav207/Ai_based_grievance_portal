const Admin = require('../models/Admin')
const Officer = require('../models/Officer')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors/')


const adminLogin = async (req, res) => {
    //send the response
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await Admin.findOne({ email })
// console.log("found in bg ,",user)
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
        // console.log("No user ")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        // console.log("not matched pas")
        throw new UnauthenticatedError('Invalid credentials');

    }

    // console.log("password matched for user ,",user)
    const token = user.createJWT();//here is errror
    // console.log("token generated ",token)
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })

}


module.exports = { adminLogin }
