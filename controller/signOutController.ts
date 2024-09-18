
import { Request , Response } from "express";

const SignOutController = (req : Request , res : Response) => {
    req.session.destroy((err) => {
        if (err) {
          return res.status(500).send({ error: 'Failed to logout' });
        }
        res.clearCookie('connect.sid');
        res.status(200).send({ message: 'Logout successful' });
      });
}

export default SignOutController;
