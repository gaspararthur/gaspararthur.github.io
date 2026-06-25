// ── Lista de posts do blog ─────────────────────────────────
// Para publicar um novo artigo:
//   1. Crie o arquivo HTML em blog/posts/slug-do-post.html
//      (copie de blog/posts/_template.html)
//   2. Adicione uma entrada AQUI no início do array (mais recente primeiro)
//
// Campos:
//   slug  → nome do arquivo HTML sem extensão
//   title → título que aparece na listagem
//   desc  → descrição curta (1–2 frases)
//   date  → data por extenso em maiúsculas, ex: "JUNHO 25, 2026"
// ──────────────────────────────────────────────────────────

const POSTS = [
  {
    slug:  "iniciação-científica",
    title: "Como é fazer iniciação científica no ensino médio?",
    desc:  "Uma reflexão sobre minha experiência como aluno pesquisador.",
    date:  "JUNHO 25, 2026"
  }
];
