import { Schema, model, Model, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    value: string;
    data: string;
    month: Schema.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    data: { type: String, required: true },
    month: { type: Schema.Types.ObjectId, ref: "Month", required: true }
});

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export default UserModel;