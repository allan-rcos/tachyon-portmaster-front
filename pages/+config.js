// pages/+config.js
// @ts-ignore
import vikeSolid from 'vike-solid/config';

export default {
  extends: [vikeSolid],
  title: 'Tachyon PortMaster',
  description: 'Sistema de Alocação de Contêineres e Carga',
  // Raiz redireciona para a única tela existente hoje.
  redirects: {
    '/': '/info'
  }
};