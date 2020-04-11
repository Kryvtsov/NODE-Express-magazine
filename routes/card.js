const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

function mapCartItems(cart) {
    return cart && cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId._id,
        count: c.count
    })) || []
}

function computePrice(courses) {
    return courses && courses.reduce((sum, c) => {
        return sum += c.price * c.count;
    }, 0)
}
router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card')
});

router.delete('/remove/:id', async (req, res) => {

    try {
        await req.user.removeFromCart(req.params.id);
        const user = await req.user.populate('cart.items.courseId').execPopulate();
        const courses = mapCartItems(user.cart);
        const cart = {
            courses, price: computePrice(courses)
        };
        res.status(200).json(cart)
    } catch (e) {
        console.log(e);
    }

});

router.get('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();

        const courses = mapCartItems(user.cart);
        res.render('card', {
            title: 'Корзина',
            courses: courses,
            price: computePrice(courses),
            isCard: true
        })
    } catch (e) {
        console.log(e);
    }

});
module.exports = router;