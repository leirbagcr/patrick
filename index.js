let paginaAtual = 1
let totalProdutos = 0
let limitePorPagina = 10

function ler_filtros_da_url() {
    // Lógica para verificar se a pessoa já entrou no site através de um link com parâmetros
    const paramsDaUrl = new URLSearchParams(window.location.search);

    if (paramsDaUrl.has("busca")) {
        document.getElementById("input-busca").value = paramsDaUrl.get("busca");
    }
    if (paramsDaUrl.has("ordenacao")) {
        document.getElementById("select-ordem").value = paramsDaUrl.get("ordenacao");
    }
    if (paramsDaUrl.has("categoria")) {
        document.getElementById("select-categoria").value = paramsDaUrl.get("categoria");
    }
    if (paramsDaUrl.has("preco_min")) {
        document.getElementById("input-preco-min").value = paramsDaUrl.get("preco_min");
    }
    if (paramsDaUrl.has("preco_max")) {
        document.getElementById("input-preco-max").value = paramsDaUrl.get("preco_max");
    }

    const paginaUrl = parseInt(paramsDaUrl.get("pagina"), 10);
    paginaAtual = Number.isNaN(paginaUrl) || paginaUrl < 1 ? 1 : paginaUrl;
}

function montar_parametros() {
    const params = new URLSearchParams();
    const valorBusca = document.getElementById("input-busca").value;
    const valorOrdem = document.getElementById("select-ordem").value;
    const valorCategoria = document.getElementById("select-categoria").value;
    const valorPrecoMin = document.getElementById("input-preco-min").value;
    const valorPrecoMax = document.getElementById("input-preco-max").value;

    if (valorBusca.trim() !== "") {
        params.append("busca", valorBusca.trim());
    }
    if (valorOrdem.trim() !== "") {
        params.append("ordenacao", valorOrdem);
    }
    if (valorCategoria.trim() !== "") {
        params.append("categoria", valorCategoria);
    }
    if (valorPrecoMin.trim() !== "") {
        params.append("preco_min", valorPrecoMin);
    }
    if (valorPrecoMax.trim() !== "") {
        params.append("preco_max", valorPrecoMax);
    }
    params.append("pagina", paginaAtual);

    return params;
}

function renderizar_paginacao() {
    const container = document.getElementById("paginacao");
    const totalPaginas = Math.max(1, Math.ceil(totalProdutos / limitePorPagina));

    if (totalPaginas <= 1) {
        container.replaceChildren();
        return;
    }

    container.innerHTML = `
        <button class="btn_enviar" ${paginaAtual <= 1 ? "disabled" : ""}
            onclick="carregar_produtos(false, ${paginaAtual - 1})">Anterior</button>
        <span>Página ${paginaAtual} de ${totalPaginas}</span>
        <button class="btn_enviar" ${paginaAtual >= totalPaginas ? "disabled" : ""}
            onclick="carregar_produtos(false, ${paginaAtual + 1})">Próxima</button>
    `;
}

async function carregar_produtos(novaBusca = false, novaPagina = null) {
    if (novaBusca) {
        paginaAtual = 1;
    } else if (novaPagina !== null) {
        paginaAtual = novaPagina;
    } else {
        // Primeira carga: recupera os filtros e a página da URL
        ler_filtros_da_url();
    }

    const params = montar_parametros();
    const paramsString = params.toString();
    // preenche os parâmetros na URL do navegador
    window.history.pushState({}, "", paramsString ? `?${paramsString}` : window.location.pathname);

    try {
        // busca dos produtos na API com parâmetros
        const resultado = await buscar_produtos(params);
        const produtos = resultado.produtos;
        totalProdutos = resultado.total;
        limitePorPagina = resultado.limite || 10;
        paginaAtual = resultado.pagina || paginaAtual;

        // lógica para mostrar os produtos no Front-End
        const container = document.getElementById("produtos");
        container.replaceChildren();

        if (produtos.length == 0) {
            container.className = "";
            container.innerHTML =
                '<p style="margin: 0; text-align: center;">❌ Não foi encontrado nenhum produto para essa busca!</p>';
            document.getElementById("paginacao").replaceChildren();
            return;
        }

        container.className = "grid-produtos";
        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";

            // As imagens são servidas pela API, fora do repositório
            const urlImagem = produto.caminho_img.startsWith("http")
                ? produto.caminho_img
                : `${link_api}/${produto.caminho_img.replace(/^\/+/, "")}`;

            card.innerHTML = `
                <img src="${urlImagem}" alt="${produto.nome}">
                <div class="nome-produto">${produto.nome}</div>
                <div class="info">
                    <div class="descricao">${produto.descricao.substring(0, 40)}...</div>
                    <div class="preco">R$ ${produto.preco.replace(".", ",")}</div>
                </div>
                <button class="btn_enviar" onclick="comprar(${produto.id})">Comprar</button>
                `;

            container.appendChild(card);
        });

        renderizar_paginacao();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        document.getElementById("produtos").className = "";
        document.getElementById("produtos").innerHTML =
            '<p style="margin: 0; text-align: center;">❌ Não foi possível carregar os produtos.</p>';
        document.getElementById("paginacao").replaceChildren();
    }
}

window.addEventListener("DOMContentLoaded", () => carregar_produtos())
