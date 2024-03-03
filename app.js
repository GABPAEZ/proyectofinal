
import { config } from 'dotenv';
import express from 'express';

config({
    path: './data/config.env'
})


export const app = express();