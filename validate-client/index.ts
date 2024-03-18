/* eslint-disable prettier/prettier */
import { APIGatewayProxyEvent,APIGatewayProxyResult } from 'aws-lambda';
import { Client } from 'pg';
import { generateJWT } from './utils/generateJwt';
import { isValidCpf } from './utils/isValidCpf';
import dotenv from "dotenv";

dotenv.config();

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });

    const secretKey = process.env.JWT_SECRET_KEY + "";

    try {
        // WHEN CLIENT WANT TO GO AS ANONYMOUS
        if (event.body === undefined || event.body === null) {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT(secretKey) }),
			};
		}
        
        await client.connect()
        const { cpf } = JSON.parse(event.body);
        const query = 'SELECT * FROM clients WHERE cpf = $1';
        const result = await client.query(query, [cpf]);

        const clients = result.rows;
        await client.end();

        // WHEN CLIENT WANT TO GO AS ANONYMOUS
        if (cpf === undefined || cpf === "") {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT(secretKey) }),
			};
		}

        if (!isValidCpf(cpf)) {
            return {
				statusCode: 400,
				body: JSON.stringify({ message: "CPF inválido" }),
			};
        } else {
            if (clients[0]) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ token: generateJWT(secretKey, clients[0]) }),
                }; 
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Cliente não encontrado" }),
                }; 
            }
        }
    } catch (err: unknown) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
};
