const {
    Router
} = require('express');

const LogEntry = require('../models/LogEntry');

const router = Router();


router.get('/',async (req, res, next) => {
    try {
        const entries = await LogEntry.find();
        res.json(entries);
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req, res, next) => {


    try {
        const log_entry = new LogEntry(req.body);
        const created_entry = await log_entry.save();
        res.json(created_entry);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(422);
        }
        next(err);
    }
    console.log(req.body);
})

module.exports = router;