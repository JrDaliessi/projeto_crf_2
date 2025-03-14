// Arquivo de exemplo para testar o ESLint e Prettier

interface Usuario {
  id: number;
  nome: string;
  email: string;
  idade?: number;
}

const usuarios: Usuario[] = [
  { id: 1, nome: 'João Silva', email: 'joao@exemplo.com', idade: 30 },
  { id: 2, nome: 'Maria Santos', email: 'maria@exemplo.com' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@exemplo.com', idade: 25 },
];

function buscarUsuarioPorId(id: number): Usuario | undefined {
  return usuarios.find(usuario => usuario.id === id);
}

function exibirInformacoes(usuario: Usuario): void {
  console.log(`Nome: ${usuario.nome}`);
  console.log(`Email: ${usuario.email}`);

  if (usuario.idade) {
    console.log(`Idade: ${usuario.idade} anos`);
  } else {
    console.log('Idade não informada');
  }
}

const usuarioEncontrado = buscarUsuarioPorId(2);

if (usuarioEncontrado) {
  exibirInformacoes(usuarioEncontrado);
} else {
  console.error('Usuário não encontrado');
}

export type { Usuario };
export { buscarUsuarioPorId, exibirInformacoes };
