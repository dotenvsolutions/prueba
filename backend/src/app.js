import express from 'express';
import config from '../libs/config'
const app = config(express())
export default app;