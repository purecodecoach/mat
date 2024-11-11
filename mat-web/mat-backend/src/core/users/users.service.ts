import { Injectable } from '@nestjs/common';
import { IUser, User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encryptString } from '@/utils/helpers/bcrypt.helper';
import { createCode, createToken } from '@/utils/helpers/token.helper';
import { USER_ROLE } from '@/utils/types/users.type';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

    async getUserByAttr(attr: any): Promise<IUser> {
        return this.userModel.findOne({ ...attr });
    }

    async createUserService(user): Promise<IUser> {
        const vToken = await createToken();
        const vCode = await createCode(6);

        const payload = {
            role: [USER_ROLE.GUEST],
            firstname: '',
            lastname: '',
            nickname: '',
            email: user.email,
            password: encryptString(user.password),
            phone: '',
            email_verified: false,
            phone_verified: false,
            vToken: vToken,
            vCode: vCode,
        };

        return this.userModel.create(payload);
    }

    async checkExistService(attr: any): Promise<boolean> {
        const user = await this.userModel.findOne({ ...attr });

        return Boolean(user?._id);
    }
}
