"use strict";

// TABACARIA DO ALEMÃO
// Preços demonstrativos: altere antes de publicar.
// Coloque suas fotos na pasta "imagens".

const WHATSAPP = "5511948404996";

const produtos = [
  { id: 1, nome: "51 Ice Limão", descricao: "Bebida — confirme disponibilidade", preco: 12.99, imagem: "imagens/51-ice-limao.jpg" },
  { id: 2, nome: "Magic Space Corn 50g", descricao: "Essência — sabor milho", preco: 15.90, imagem: "imagens/magic-space-corn.jpg" },
  { id: 3, nome: "Magic Purple Passion 50g", descricao: "Essência — linha Magic", preco: 15.90, imagem: "imagens/magic-purple-passion.jpg" },
  { id: 4, nome: "Magic Space Mix 50g", descricao: "Essência — confirme o sabor", preco: 15.90, imagem: "imagens/magic-space-mix.jpg" }
];

const grade = document.getElementById("grade-produtos");
const carrinhoEl = document.getElementById("carrinho");
const fundo = document.getElementById("fundo-modal");
const itensEl = document.getElementById("itens-carrinho");
const contadorEl = document.getElementById("contador");
const totalEl = document.getElementById("total");
let carrinho = [];

const dinheiro = valor => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function carregarProdutos() {
  grade.innerHTML = produtos.map(p => `
    <article class="produto">
      <img src="${escapar(p.imagem)}" alt="${escapar(p.nome)}" loading="lazy"
        onerror="this.onerror=null;this.style.display='none'">
      <div class="produto-info">
        <h3>${escapar(p.nome)}</h3><p>${escapar(p.descricao)}</p>
        <div class="preco">${dinheiro(p.preco)}</div>
        <button class="adicionar" data-id="${p.id}">ADICIONAR AO CARRINHO</button>
      </div>
    </article>`).join("");
}
function adicionar(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  const item = carrinho.find(p => p.id === id);
  if (item) item.quantidade++;
  else carrinho.push({ ...produto, quantidade: 1 });
  atualizarCarrinho();
  abrirCarrinho();
}
function alterarQuantidade(id, variacao) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;
  item.quantidade += variacao;
  if (item.quantidade <= 0) carrinho = carrinho.filter(p => p.id !== id);
  atualizarCarrinho();
}
function remover(id) {
  carrinho = carrinho.filter(p => p.id !== id);
  atualizarCarrinho();
}
function atualizarCarrinho() {
  contadorEl.textContent = carrinho.reduce((s, p) => s + p.quantidade, 0);
  totalEl.textContent = dinheiro(carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0));
  if (!carrinho.length) {
    itensEl.innerHTML = '<p class="vazio">Seu carrinho está vazio.</p>';
    return;
  }
  itensEl.innerHTML = carrinho.map(p => `
    <div class="item-carrinho"><div><h3>${escapar(p.nome)}</h3>
      <p>${dinheiro(p.preco * p.quantidade)}</p>
      <div class="controles">
        <button data-acao="menos" data-id="${p.id}" aria-label="Diminuir">−</button>
        <span>${p.quantidade}</span>
        <button data-acao="mais" data-id="${p.id}" aria-label="Aumentar">+</button>
      </div></div>
      <button class="remover" data-acao="remover" data-id="${p.id}">Excluir</button>
    </div>`).join("");
}
function abrirCarrinho() {
  carrinhoEl.classList.add("aberto");
  fundo.classList.add("aberto");
  carrinhoEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-aberto");
}
function fecharCarrinho() {
  carrinhoEl.classList.remove("aberto");
  fundo.classList.remove("aberto");
  carrinhoEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-aberto");
}
function finalizarPedido() {
  if (!carrinho.length) {
    alert("Adicione um produto ao carrinho primeiro.");
    return;
  }
  const linhas = carrinho.map(p => `- ${p.nome} x${p.quantidade}: ${dinheiro(p.preco * p.quantidade)}`);
  const total = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);
  const mensagem = ["Olá, Tabacaria do Alemão! Quero consultar este pedido:", "", ...linhas, "", `Total estimado: ${dinheiro(total)}`, "", "Por favor, confirme estoque, entrega e pagamento."].join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener,noreferrer");
}
grade.addEventListener("click", e => {
  const botao = e.target.closest("[data-id]");
  if (botao) adicionar(Number(botao.dataset.id));
});
itensEl.addEventListener("click", e => {
  const botao = e.target.closest("[data-acao]");
  if (!botao) return;
  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === "mais") alterarQuantidade(id, 1);
  if (botao.dataset.acao === "menos") alterarQuantidade(id, -1);
  if (botao.dataset.acao === "remover") remover(id);
});
document.getElementById("abrir-carrinho").addEventListener("click", abrirCarrinho);
document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
fundo.addEventListener("click", fecharCarrinho);
document.getElementById("finalizar").addEventListener("click", finalizarPedido);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && carrinhoEl.classList.contains("aberto")) fecharCarrinho();
});
document.getElementById("ano").textContent = new Date().getFullYear();
carregarProdutos();
atualizarCarrinho();