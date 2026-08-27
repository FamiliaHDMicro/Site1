export async function onRequestPost(context) {
    try {
        // 1. Pega os dados que o usuário digitou no painel.html
        const dados = await context.request.json();
        
        const { template, photoUrl, musicUrl, videoUrl } = dados;

        // 2. Segurança básica: Valida se os campos obrigatórios vieram preenchidos
        if (!template || !photoUrl || !musicUrl) {
            return new Response(JSON.stringify({ erro: "Campos obrigatórios ausentes." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 3. Conecta com o banco D1 do Cloudflare (Troque 'DB' pelo nome exato da sua Binding se for diferente)
        const db = context.env.DB; 

        // 4. Gera um link único (ID) para o microsite do cliente usando a data/hora atual
        const idUnico = "site_" + Math.random().toString(36).substr(2, 9);

        // 5. Salva as informações na tabela do banco de dados
        // IMPORTANTE: Sua tabela no D1 precisa ter essas colunas (id, template, foto, musica, video)
        await db.prepare(
            "INSERT INTO microsites (id, template, foto, musica, video) VALUES (?, ?, ?, ?, ?)"
        ).bind(idUnico, template, photoUrl, musicUrl, videoUrl || "").run();

        // 6. Retorna a resposta de sucesso e devolve o link que a máquina gerou
        return new Response(JSON.stringify({ 
            sucesso: true, 
            mensagem: "Microsite gerado com sucesso!",
            link: `/ver?id=${idUnico}` 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (erro) {
        // Se der qualquer problema malicioso ou erro no banco, o sistema avisa aqui
        return new Response(JSON.stringify({ erro: "Erro interno na máquina: " + erro.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

