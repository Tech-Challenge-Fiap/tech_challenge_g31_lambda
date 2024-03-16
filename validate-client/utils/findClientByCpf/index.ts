/* eslint-disable prettier/prettier */
import { Client } from 'pg';

export const findClientByCpf = async (cpf: string, dbConnection: Client): Promise<any> => {
	try {
        await dbConnection.connect();

        const query = 'SELECT * FROM clientes WHERE cpf = $1';
        const result = await dbConnection.query(query, [cpf]);

        // Retornar os resultados da consulta
        return result.rows;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    } finally {
        // Fechar a conexão com o banco de dados
        await dbConnection.end();
    }
};