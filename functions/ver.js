    <script>
        async function buscar() {
            const p = new URLSearchParams(window.location.search);
            const id = p.get('id');
            
            if (!id) {
                document.getElementById('tela').innerHTML = "<h2 style='color: red;'>ID Inválido!</h2>";
                return;
            }

            try {
                // LINK CORRIGIDO E LIMPO APONTANDO PARA O SEU WORKER REAL
                const r = await fetch(`https://workers.dev{id}`);
                const dados = await r.json();
                
                if (!r.ok) throw new Error();

                document.getElementById('tela').innerHTML = `
                    <img src="${dados.foto}" alt="Imagem">
                    <h2>Seu Espaço Digital</h2>
                    <a class="btn-link" href="${dados.musica}" target="_blank">👉 CLIQUE AQUI PARA OUVIR A MÚSICA</a>
                `;
            } catch(e) {
                document.getElementById('tela').innerHTML = "<h2 style='color: red;'>Microsite não encontrado!</h2>";
            }
        }
        buscar();
    </script>
