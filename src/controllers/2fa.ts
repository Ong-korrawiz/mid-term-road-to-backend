import {Request, Response, Router, NextFunction} from "express";
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import dotenv from 'dotenv'
import { verify } from 'crypto';

dotenv.config()

var secret = speakeasy.generateSecret(
    {
        name: "MyApp"
    }
);

export const getQRCode = () => {
    QRCode.toDataURL(
        secret.otpauth_url as string, 
        function(err, data_url) {
        console.log(secret)
        console.log(data_url);
        return data_url
    });
}

export const verifyOTP = (req: Request, res: Response) => {
    const token = req.headers['otp_token'] as string
    console.log(
        secret['ascii'],
        token
    )
    var verified = speakeasy.totp.verify(
        {
            secret: secret['ascii'],
            encoding: 'ascii',
            token: String(token)
        }
    );

    return verified
}