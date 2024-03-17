/* eslint-disable prettier/prettier */
import { Client } from 'pg';

export const findClientByCpf = async (cpf: string, dbConnection: Client): Promise<any> => {
	try {
        await dbConnection.connect();

        const query = 'SELECT * FROM clients WHERE cpf = $1';
        const result = await dbConnection.query(query, [cpf]);

        await dbConnection.end();

        // Retornar os resultados da consulta
        return result.rows;
    } catch (error) {
        await dbConnection.end();
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
};