import express from 'express';
import cors from 'cors';
import returnRouter from "./routes/return-router.js";
import returnItemRouter from "./routes/return-item-router.js";
import productsRouter from './routes/product-router.js';
import userRouter from './routes/user-router.js';
import {userLogin} from "./controller/user-controller.js";


const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    // todo: port may vary, if its wrong the items in the controller interface won't show up?
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/images', express.static('images'));

const tokenRouter = express.Router();
tokenRouter.post('/tokens', userLogin);

app.use('/', tokenRouter);
app.use('/products', productsRouter);
app.use('/returns', returnRouter);
app.use('/return-items', returnItemRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})