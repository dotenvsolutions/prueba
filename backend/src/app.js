import express from 'express';
import config from './infraestructure/libs/config'
const app = config(express())
export default app;