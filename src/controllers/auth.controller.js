import { AuthService } from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const user = await AuthService.signup(req.body.email, req.body.password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { access, refresh } = await AuthService.login(req.body.email, req.body.password);
    res.json({ access, refresh });
  } catch (err) { next(err); }
};

export const refresh = async (req, res, next) => {
  try {
    const { access, refresh } = await AuthService.refresh(req.body.refresh);
    res.json({ access, refresh });
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    await AuthService.logout(req.body.refresh);
    res.status(204).end();
  } catch (err) { next(err); }
};
