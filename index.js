const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const orderRoutes = require('./routes/orders');
const authRouters = require('./routes/auth');
const mongoose = require('mongoose');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const MONGODB_URI = `mongodb+srv://vova:yXzAn7tPcjoCLjkx@cluster0-1jvkg.mongodb.net/shop`;
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('5e80a45e7994e74a8acedf90');
//         req.user = user;
//         next()
//     } catch (e) {
//         console.log(e);
//     }
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRouters);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'vovTest@gmail.com',
        //         name: 'Vova',
        //         cart: {items: []}
        //     });
        //     await user.save()
        // }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (e) {
        console.log(e);
    }
}

start();