const express = require('express')
const router = express.Router()
const {
    create_user,
    delete_user,
    getfunc,
    search_user } = require('../controllers/user')

router.route('/')
    .get((req, res) => {
        getfunc(req, res);
    })
    .post(async (req, res) => {
        console.log(req.body)
        create_user(req,res)
    })
router.route('/user/')
    .get((req, res) => {
        getfunc(req, res);
    })
    .post(async (req, res) => {
        console.log(req.body)
        create_user(req,res)
    })

router.
    route('/user/:id')
    .delete(async (req, res) => {
        delete_user(req,res)
    })
    .get(async (req, res) => {
        search_user(req, res)
    })

module.exports = router;