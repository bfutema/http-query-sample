import 'reflect-metadata';
import 'dotenv/config';

import '../../containers';

import cors from 'cors';
import express from 'express';

import 'express-async-errors';

import { connect } from '../typeorm';
import { routes } from './routes';

connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

export { app };
