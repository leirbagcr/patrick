let link_api = "http://localhost:3000";

async function buscar_produtos(queryParams) {
    let rota = "/produto"
    const queryString = queryParams.toString();
    if (queryString){
        rota+= "?" + queryString
    }
    const resposta = await fetch(link_api + rota);
    
    if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
    }

    const resposta_json = await resposta.json();
    return {
        produtos: resposta_json,
        total: Number(resposta.headers.get("X-Total-Count")) || resposta_json.length,
        pagina: Number(resposta.headers.get("X-Pagina")) || 1,
        limite: Number(resposta.headers.get("X-Limite")) || resposta_json.length
    };
}