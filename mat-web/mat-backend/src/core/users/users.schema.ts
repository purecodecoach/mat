import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';
import { USER_ROLE, USER_STATUS } from '@/utils/types/users.type';
import { ApiProperty } from '@nestjs/swagger';

export type IUser = User & Document;

@Schema({
    toJSON: {
        virtuals: true,
        transform: function (doc: any, ret: any) {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.vToken;
            delete ret.vCode;
            return ret;
        },
    },
})
export class User {
    @ApiProperty({ example: '67219336f37dcce3938f8847' })
    id: string;

    @ApiProperty({ example: 'John' })
    @Prop()
    firstname: string;

    @ApiProperty({ example: 'Doe' })
    @Prop()
    lastname: string;

    @ApiProperty({ example: 'Black Beast' })
    @Prop()
    nickname: string;

    @ApiProperty({ example: 'john@example.com' })
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty()
    @Prop({ default: false })
    email_verified: boolean;

    @Prop({})
    vToken: string;

    @Prop({})
    vCode: string;

    @ApiProperty({ example: '+1 (253) 533-2244' })
    @Prop({ required: false })
    phone: string;

    @ApiProperty({ example: 'https://assets.tp.com/profile/me.jpg' })
    @Prop({ required: false })
    photo: string;

    @ApiProperty()
    @Prop({ default: false })
    phone_verified: boolean;

    @ApiProperty({
        type: [USER_ROLE],
        enum: USER_ROLE,
        isArray: true,
        example: [USER_ROLE.GUEST],
        enumName: 'USER_ROLE',
    })
    @Prop({
        type: [String],
        enum: USER_ROLE,
        required: true,
        default: [USER_ROLE.GUEST],
    })
    role: USER_ROLE[];

    @Prop({})
    password: string;

    @ApiProperty({ example: ['Soccer', 'Basket Ball'] })
    @Prop()
    favorites: string[];

    @ApiProperty({ type: USER_STATUS, enum: USER_STATUS, example: USER_STATUS.ACTIVE, enumName: 'USER_STATUS' })
    @Prop({ type: String, enum: USER_STATUS, default: USER_STATUS.INACTIVE })
    status: USER_STATUS;

    @ApiProperty()
    @Prop({ default: now() })
    created_at: Date;

    @ApiProperty()
    @Prop({ default: now() })
    updated_at: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function (this: IUser) {
    return this._id;
});

export { UserSchema };
