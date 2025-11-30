import express from "express";
import { config } from 'dotenv';
config();
import cors from 'cors';
import connectToDB from './db/connection.js';
import routerHandler from './utilits/controller-handller.js';

async function bootstrap() {
  connectToDB();

  const whitelist = [process.env.front_end_url];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  




  const app = express();

  app.use(express.json());

  app.use(cors(corsOptions));


  routerHandler(app);

  app.get('/', (req, res) => {
    res.status(200).json({ message: "server is running" });
  });
  const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
}

export default bootstrap;
