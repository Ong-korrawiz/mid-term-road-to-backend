import {Request, Response, Router, NextFunction} from "express";
const router = Router();
import {
    getUser,
    addUser,
    checkUser,
    verifyToken,
} from "../../controllers/auth";
import { verifyOTP } from "../../controllers/2fa";


router.get('/username', getUser);
router.post('/register', addUser);
router.get('/login', checkUser);
router.get('/login/2fa', verifyOTP)
router.get('/test/role', verifyToken, (req: Request, res: Response) => {
    res.status(200).json({ message: 'User content' });
    if (req.user){
        console.log(req.user.role)
    }
});
router.get('/test/editor', verifyToken, (req: Request, res: Response) => {
    if (req.user?.role === "editor"){
        return res.status(200).json({ message: 'Editor content' });
    }
    console.log("Editor role required!")
    return res.status(403).json({ message: 'Editor role is required' })

})

export default router;
