const express = require('express')
const router = express.Router()
const { getUserDetails, updateUserDetails } = require('../controllers/user')
// const { roleAuthenticationMiddleware } = require('../middleware/roleAuthentication')

router.route('/').get(getUserDetails).patch(updateUserDetails)
router.route('/history').get(getHistory)
module.exports = router