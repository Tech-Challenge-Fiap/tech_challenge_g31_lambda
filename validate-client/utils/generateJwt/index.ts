/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';

interface IClient {
    cpf: string;
    name: string;
    email: string;
}

export const generateJWT = (secretKey: string, client?: IClient) => {
    let payload = {};

    if (client) {
        payload = {
            cpf: client.cpf,
            name: client.name,
            email: client.email,
        };
    }

    return jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
};
