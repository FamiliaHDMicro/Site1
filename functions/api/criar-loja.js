// ============================================================
// SITEONE — Worker de Criação de Loja
// Autor: Qwen + HDMicro
// Data: Setembro/2026
// ============================================================
// O que esse arquivo faz:
// 1. Recebe os dados do formulário (POST)
// 2. Valida se o domínio está disponível
// 3. Salva na tabela "lojas" do D1
// 4. Retorna o link da loja criada
// ============================================================

export async function onRequestPost(context) {
  try {
    // 1. Pega os dados que vieram do formulário
    const dados = await context.request.json();
    
    // 2. Valida campos obrigatórios
    const { nome, nome_loja, subdomain, nicho, plano, zap } = dados;
    
    if (!nome || !nome_loja || !subdomain || !nicho || !plano) {
      return new Response(JSON.stringify({ 
        erro: "Campos obrigatórios ausentes" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 3. Valida o subdomínio (só letras, números, mínimo 3)
    const subdomainLimpo = subdomain
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .substring(0, 30);
    
    if (subdomainLimpo.length < 3) {
      return new Response(JSON.stringify({ 
        erro: "Domínio muito curto (mínimo 3 caracteres)" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 4. Verifica se o domínio já está em uso
    const db = context.env.DB;
    const existente = await db.prepare(
      "SELECT id FROM lojas WHERE subdomain = ?"
    ).bind(subdomainLimpo).first();
    
    if (existente) {
      return new Response(JSON.stringify({ 
        erro: "Este domínio já está em uso. Tente outro nome." 
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 5. Gera um ID único para a loja
    const idLoja = "loja_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    
    // 6. Define data de expiração das mídias (30 dias a partir de agora)
    const dataExpira = new Date();
    dataExpira.setDate(dataExpira.getDate() + 30);
    const dataExpiraStr = dataExpira.toISOString().split('T')[0];
    
    // 7. Define próxima cobrança (30 dias)
    const dataCobranca = new Date();
    dataCobranca.setDate(dataCobranca.getDate() + 30);
    const dataCobrancaStr = dataCobranca.toISOString().split('T')[0];
    
    // 8. Salva no banco D1
    await db.prepare(`
      INSERT INTO lojas 
      (id, nome, nome_loja, subdomain, nicho, plano, setup_pago, mensal_pago, ativa, zap, data_expira_midia, data_proxima_cobranca)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, 1, ?, ?, ?)
    `).bind(
      idLoja, 
      nome, 
      nome_loja, 
      subdomainLimpo, 
      nicho, 
      plano, 
      zap || '',
      dataExpiraStr,
      dataCobrancaStr
    ).run();
    
    // 9. Retorna sucesso com os dados da loja criada
    return new Response(JSON.stringify({ 
      sucesso: true,
      mensagem: "Loja criada com sucesso!",
      loja: {
        id: idLoja,
        nome: nome_loja,
        subdomain: subdomainLimpo,
        link: `https://${subdomainLimpo}.pages.dev`,
        plano: plano,
        nicho: nicho
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (erro) {
    console.error("Erro ao criar loja:", erro);
    return new Response(JSON.stringify({ 
      erro: "Erro interno: " + erro.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
