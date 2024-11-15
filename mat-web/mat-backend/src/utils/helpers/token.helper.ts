import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const createCode = async (length: number): Promise<string> => {
    const characters = '0123456789';

    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const createToken = async (): Promise<string> => {
    let token = '';

    const salt = await bcrypt.genSalt();
    const code = uuid().replaceAll('-', '') + Date.now();
    token = await bcrypt.hash(code, salt);

    return token;
};

export { createCode, createToken };
