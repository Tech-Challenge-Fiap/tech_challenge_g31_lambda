/* eslint-disable prettier/prettier */
import { Client } from 'pg';

export const findClientByCpf = async (cpf: string, client: Client): Promise<any> => {
    const query = 'SELECT * FROM clients WHERE cpf = $1';
    const result = await client.query(query, [cpf]);

    // Retornar os resultados da consulta
    return result.rows;
};