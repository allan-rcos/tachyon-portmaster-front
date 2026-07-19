// pages/+config.js
// @ts-expect-error — vike-solid/config não expõe tipos
import vikeSolid from 'vike-solid/config';

export default {
  extends: [vikeSolid],
  description: 'Sistema de Alocação de Contêineres e Carga',
  // Raiz redireciona para o painel operacional.
  redirects: {
    '/': '/painel',
  },
  // O <title> é definido dinamicamente em pages/+Head.tsx a partir de
  // `data.title` — não definimos `title` aqui para evitar dois <title>.
};
