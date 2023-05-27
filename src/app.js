import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import __dirname from "./utils.js";
import adminRouter from "./router/admin.routes.js";
import sessionRouter from "./router/session.routes.js";
import viewsRouter from "./router/views.routes.js";
import chatRouter from "./router/chat.routes.js"
import cartRouter from "./router/cart.routes.js"
import productRouter from "./router/product.routes.js"
import initializePassport from "./config/passport.config.js";



const DB = 'ecommerce';
const MONGO = "mongodb+srv://freddymdq:federico@cluster0.wm7ahcr.mongodb.net/" + DB
const PORT = process.env.PORT || 8080;
const app = express();
const connect = mongoose.connect(MONGO);
const server = app.listen(PORT, ()=>{
  console.log('Servidor funcionando en el puerto: '+ PORT);
})

app.use (session({
  store: new MongoStore({
    mongoUrl: MONGO,
    ttl:3600
  }),
  secret: 'CoderSecret',
  resave: false,
  saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Estaticos
app.use(express.static(__dirname+'/public'));
// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// routes
app.use('/', viewsRouter)
app.use('/api/sessions', sessionRouter); 
app.use('/api/chat', chatRouter)
app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);
app.use('/', adminRouter);
