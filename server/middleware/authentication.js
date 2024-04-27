const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors/')
// const blacklist = import('../models/Blacklist')

const auth = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }

    const token = authHeader.split(' ')[1]
    // console.log("token from backend", token)
    console.log("GOT TOKEN")
    // const checkIfBlacklisted = await Blacklist.findOne({ token: token });
    // if (checkIfBlacklisted) return res.sendStatus(204)

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to the routes

        req.user = { userId: payload.userId, name: payload.name }
        console.log("user verified in backend")
        next()

    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }

}

module.exports = auth