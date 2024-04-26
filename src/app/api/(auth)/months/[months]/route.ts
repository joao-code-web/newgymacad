import { NextRequest, NextResponse } from "next/server";
import connect from "../../../../../../lib/db";
import MonthModel from "../../../../../../lib/modals/month"; // Alterado o nome do modelo para MonthModel

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);

        const pathname = url.pathname;

        const segments = pathname.split("/");
        const monthId = segments[segments.length - 1]; // Alterado para monthId

        // Verificar se monthId está presente
        if (!monthId) {
            return NextResponse.json({ message: "Missing monthId", status: 400 });
        }

        await connect(); // Conectar ao banco de dados

        // Buscar o mês pelo ID
        const month = await MonthModel.findById(monthId); // Alterado para buscar mês

        // Verificar se o mês foi encontrado
        if (!month) {
            return NextResponse.json({ message: "Month not found", status: 404 });
        }

        // Retornar o mês encontrado
        return NextResponse.json(month);
    } catch (error) {
        // Lidar com erros
        console.error(error);
        return NextResponse.json({ message: "Error", status: 500 });
    }
}
