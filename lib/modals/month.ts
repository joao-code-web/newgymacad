import { Schema, model, Model, Document, models } from "mongoose";

export interface IMonth extends Document {
    name: string;
}

const MonthSchema: Schema<IMonth> = new Schema<IMonth>({
    name: { type: String, required: true, unique: true },
});

const MonthModel: Model<IMonth> = models.Month || model<IMonth>("Month", MonthSchema);

export default MonthModel;
