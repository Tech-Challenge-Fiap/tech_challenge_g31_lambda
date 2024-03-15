/* eslint-disable prettier/prettier */
import { cpf } from 'cpf-cnpj-validator'

export const isValidCpf = (inputCpf: string): boolean => {
	const formattedCpf = inputCpf.replace(/\D/g, "");

    return cpf.isValid(formattedCpf);
};