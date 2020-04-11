const {Router} = require('express');
const Course = require('../models/course');
const router = Router();


router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().lean();

        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            courses
        })
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const course = await Course.findById(req.params.id).lean();

        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e);
    }

});

router.post('/edit', async (req, res) => {
    const {id} = req.body;
    delete req.body.id;
    try {
        await Course.findByIdAndUpdate(id, req.body);
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
});

router.post('/remove', async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).lean();
        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e);
    }
});
module.exports = router;