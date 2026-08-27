export async function onRequestGet(context) {
    try {
        const { searchParams } = new URL(context.request.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ erro: "ID não fornecido." }), { status: 400 });
        }

        const db = context.env.DB;

        // Busca o microsite no banco de dados D1
        const resultado = await db.prepare(
            "SELECT * FROM microsites WHERE id = ?"
        ).bind(id).first();

        if (!resultado) {
            return new Response(JSON.stringify({ erro: "Microsite não encontrado." }), { status: 404 });
        }

        return new Response(JSON.stringify(resultado), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (erro) {
        return new Response(JSON.stringify({ erro: "Erro ao ler a máquina: " + erro.message }), { status: 500 });
    }
}

