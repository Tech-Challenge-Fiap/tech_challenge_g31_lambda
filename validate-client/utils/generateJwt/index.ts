/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';
import { IClient } from '../../interfaces/IClient';

export const generateJWT = (secretKey: string, client?: IClient) => {
    let payload = {};

    if (client) {
        payload = {
            cpf: client.cpf,
            name: client.name,
            email: client.email,
        };
    } else {
        payload = {
            cpf: 'anonymous'
        }
    }

    return jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
};
