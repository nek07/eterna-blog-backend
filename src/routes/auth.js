import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';

const r = Router();
r.post('/signup', ctrl.signup);
r.post('/login',  ctrl.login);
r.post('/refresh',ctrl.refresh);
r.post('/logout', ctrl.logout);
export { r as authRouter };
