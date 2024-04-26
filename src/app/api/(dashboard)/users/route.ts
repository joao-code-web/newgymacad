import { NextRequest, NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import MonthModel from "../../../../../lib/modals/month";
import UserModel from "../../../../../lib/modals/users";
import { Types } from "mongoose";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const monthId = searchParams.get("monthId"); // Alterado para monthId

        if (!monthId || !Types.ObjectId.isValid(monthId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid month ID" }),
                { status: 400 }
            );
        }

        await connect();

        const month = await MonthModel.findById(monthId);
        if (!month) {
            return new NextResponse(
                JSON.stringify({ message: "Month not found" }),
                { status: 404 }
            );
        }

        const users = await UserModel.find({ month: new Types.ObjectId(monthId) }); // Buscar usuários pelo ID do mês

        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.error("Error in GET:", error);
        return new NextResponse(
            JSON.stringify({
                message: "Error",
                error,
            }),
            { status: 500 }
        );
    }
}

export const POST = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const monthId = searchParams.get("monthId"); // Alterado para monthId

        const body = await req.json();
        const { name, value, data } = body; // Alterado para name, value e data

        if (!monthId || !Types.ObjectId.isValid(monthId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid month ID" }),
                { status: 400 }
            );
        }

        await connect();

        const month = await MonthModel.findById(monthId);
        if (!month) {
            return new NextResponse(
                JSON.stringify({ message: "Month not found" }),
                { status: 404 }
            );
        }

        const newUser = new UserModel({ // Criar um novo usuário associado ao mês correto
            name,
            value,
            data,
            month: new Types.ObjectId(monthId)
        });

        await newUser.save();

        return new NextResponse(
            JSON.stringify({ message: "User created", user: newUser }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in POST:", error);
        return new NextResponse(
            JSON.stringify({
                message: "Error",
                error,
            }),
            { status: 500 }
        );
    }
}

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const monthId = searchParams.get("monthId"); // Alterado para monthId
        const userId = searchParams.get("userId");

        if (!monthId || !Types.ObjectId.isValid(monthId) || !userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid month or user ID" }),
                { status: 400 }
            );
        }

        await connect();

        const month = await MonthModel.findById(monthId);
        if (!month) {
            return new NextResponse(
                JSON.stringify({ message: "Month not found" }),
                { status: 404 }
            );
        }

        const user = await UserModel.findOne({ _id: userId, month: monthId }); // Buscar usuário pelo ID e ID do mês
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in this month" }),
                { status: 404 }
            );
        }

        await UserModel.findByIdAndDelete(userId);

        return new NextResponse(
            JSON.stringify({ message: "User deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in DELETE:", error);
        return new NextResponse(
            JSON.stringify({
                message: "Error",
                error,
            }),
            { status: 500 }
        );
    }
}
