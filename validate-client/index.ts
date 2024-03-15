/* eslint-disable prettier/prettier */
import { APIGatewayProxyEvent,APIGatewayProxyResult } from 'aws-lambda';
import { generateJWT } from './utils/generateJwt';
import { isValidCpf } from './utils/isValidCpf';

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

    const secretKey = 'teste'

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

        // fazer pesquisa no banco de dados

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
            }),
        };
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
