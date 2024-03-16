/* eslint-disable prettier/prettier */
import { APIGatewayProxyEvent,APIGatewayProxyResult } from 'aws-lambda';
import { Client } from 'pg';
import { generateJWT } from './utils/generateJwt';
import { isValidCpf } from './utils/isValidCpf';
import { IClient } from './interfaces/IClient';
import { findClientByCpf } from './utils/findClientByCpf';
import { randomBytes } from 'crypto';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // let response: APIGatewayProxyResult;
    const client = new Client({
        user: 'fiaptc_user',
        host: 'fiaptc-db.cdgs0qagmcuo.us-east-2.rds.amazonaws.com',
        database: 'fiaptc_db',
        password: 'fiaptc-dbpass',
        port: 5432,
    });

    const secretKey = randomBytes(32).toString('base64');

    try {
        // WHEN CLIENT WANT TO GO AS ANONYMOUS
        if (event.body === undefined || event.body === null) {
			return {
				statusCode: 200,
				body: JSON.stringify({ token: generateJWT(secretKey) }),
			};
		}
        // WHEN CLIENT WANT TO GO AS ANONYMOUS
        const { cpf } = JSON.parse(event.body);
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
		}

        await client.connect()

        const clienteTeste = await findClientByCpf(cpf, client) as IClient[];

        if (clienteTeste[0]) {
            return {
				statusCode: 200,
				body: JSON.stringify({
					token: generateJWT(secretKey, clienteTeste[0]),
				}),
			};
        } else {
            return {
				statusCode: 404,
				body: JSON.stringify({ message: "Cliente não encontrado" }),
			};
        }
    } catch (err: unknown) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
};
