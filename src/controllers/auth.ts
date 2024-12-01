import express, {Request, Response, Router, NextFunction, Application} from "express";
import mysql, { RowDataPacket } from 'mysql2';
import conn from "../db";
import dotnev from 'dotenv'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getQRCode, verifyOTP } from "./2fa";


dotnev.config()
interface User extends RowDataPacket{
    id: number;
    name: string;
    role: string;
    email: string;
};

// Extend the Express Request interface using declaration merging
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; role: string };
    }
  }
}

/**
 * @swagger
 * /api/auth/username:
 * get:
 * summary: Get all username
 * description: Get all username
 * responses:
 * 200:
 * description: A list of users
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * 500:
 * description: Some error happened
 */
export const getUser = async (req: Request, res: Response) => {
    conn.query<User[]>(
        'SELECT id, username, email FROM users;',
        (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error occurred while retrieving usernames.', error: err });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'User not found.' });
            } else {
                res.status(200).json({ message: 'User retrieved successfully.', data: result });
            }
        }
    });
};


export const addUser = async (req: Request, res: Response) => {
    const { username, password, email} = req.body;
    bcrypt.hash(password,  Number(process.env.SALT), (err, hash) => {
        if (err) {
            console.log('Fail hashing the password')
        }
        console.log('Hashed password', hash)
        const sql = 'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?);'
        conn.query(sql, [username, hash, process.env.DEFAULT_ROLE, email], (err, result) => {
            if (err) {
                if (err["code"] === "ER_DUP_ENTRY"){
                    console.log(err["message"]);
                }
                else {
                    res.status(500).json({ message: 'Error occurred while registering username.', error: err });
                };
            } else {
                res.status(200).json({ message: 'User registered successfully.', data: result});
            }
        });
    });
    
}

export const checkUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    bcrypt.hash(password,  Number(process.env.SALT), (err, hash) => {
        if (err) {
            console.log('Fail hashing the password')
        }

        conn.query(
            'SELECT * FROM users WHERE username=?',
            [username, hash],
            async (err, result: User[]) => {
                const user = result[0]
                const isPasswordValid = await bcrypt.compare(password, user.password);
                console.log(isPasswordValid)
                
                if (err){
                    res.status(500).json({ message: 'Incorrect username or password', error: err });
                    return;
                } 
                
                if (result.length < 1 || !isPasswordValid) {
                    res.status(401).json({ message: 'Incorrect username or password' });
                    return;
                } 
                const qrCode = getQRCode()
                console.log("QR code: ", qrCode)

                const verifiedOTP = verifyOTP(req, res)
                if (! verifiedOTP) {
                    return res.status(401).json({ message: 'Incorrect OTP'});
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    },
                    String(process.env.SECRET_KEY),
                    { expiresIn: '1h'}
                    
                )
                console.log('Token', token)
                console.log('correct password', hash, result[0]['password'])
                res.status(200).json({ message: 'Login sucessful!'});
            }
        );
    });
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    console.log("CALLED!")
    const token = req.headers['authorization'] as string
    // console.log(req)
    console.log(token)
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, String(process.env.SECRET_KEY), (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token'})
        }
        req.user = decoded as { id: number; username: string; role: string };
        next();
    })

}


export default getUser