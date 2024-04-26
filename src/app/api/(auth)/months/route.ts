import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import MonthModel from "../../../../../lib/modals/month"; // Alterado o nome do modal para MonthModel
import { Types } from "mongoose";


export const GET = async () => {
    try {
        await connect();
        const months = await MonthModel.find(); // Alterado para buscar meses em vez de usuários
        return NextResponse.json(months); // Retornar os meses encontrados
    } catch (error) {
        console.error("Error in fetching months:", error);
        return new NextResponse("Error in fetching months: " + error, { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        await connect();
        const newMonth = new MonthModel(body); // Alterado para criar um novo mês
        await newMonth.save(); // Salvar o novo mês
        return new NextResponse(JSON.stringify({ message: "created", MonthModel: newMonth }));
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating Month",
                error,
            }),
            { status: 500 }
        );
    }
};

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();
        const { monthId, newUsername } = body; // Alterado para monthId e newUsername
        await connect();

        if (!monthId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "Something went wrong" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(monthId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid month ID" }),
                { status: 400 }
            );
        }

        const updatedMonth = await MonthModel.findOneAndUpdate(
            { _id: new Types.ObjectId(monthId) },
            { username: newUsername }, // Alterado para atualizar o nome de usuário
            { new: true }
        );

        if (!updatedMonth) {
            return new NextResponse(
                JSON.stringify({ message: "Month cannot be updated" }),
                { status: 400 }
            );
        }

        return new NextResponse(JSON.stringify(updatedMonth), { status: 200 });
    } catch (error) {
        console.error("Error in PATCH:", error);
        return new NextResponse(
            JSON.stringify({
                message: "Error in PATCH",
                error,
            }),
            { status: 500 }
        );
    }
};

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const monthId = searchParams.get("monthId"); // Alterado para monthId

        console.log(monthId);

        if (!monthId) {
            return NextResponse.json({ message: "Missing monthId", status: 400 });
        }

        await connect(); // Conectar ao banco de dados

        const monthToDelete = await MonthModel.findById(monthId);

        if (!monthToDelete) {
            return NextResponse.json({ message: "Month not found", status: 404 });
        }

        await MonthModel.findByIdAndDelete(new Types.ObjectId(monthId));

        return NextResponse.json({ message: "Month deleted successfully", status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", status: 500 });
    }
};
