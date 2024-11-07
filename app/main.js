const apiUrl = '/api';

const submit = document.getElementById('submit');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName.startsWith('data-')) {
      const habilitarCadastro =
        mutation.target.dataset.id
          ? Object.entries(mutation.target.dataset).some(([k, v]) => k !== 'id' && v.length > 0)
          : Object.values(mutation.target.dataset).every((v) => v.length > 0)

      submit.toggleAttribute('disabled', !habilitarCadastro);
    }
  })
})

const form = document.getElementById('formulario');
const lista = document.getElementById('lista');
const btDeletar = document.getElementById('deletar');

function resetarSubmit() {
  submit.setAttribute('disabled', '');
  submit.value = 'Cadastrar';
}

function resetarBtDeletar() {
  btDeletar.setAttribute('disabled', '');
}

function limparCampos() {
  form.querySelectorAll('input[type="text"]')
  .forEach((input) => {
    input.value = ''
  });
}

function iniciarForm() {
  form.dataset.nome = '';
  form.dataset.idade = '';
  form.dataset.cidade = '';

  limparCampos();
}

function digitar() {
  form.dataset[this.name] = this.value;
}

function selecionarPessoa() {
  const selecionado = document.querySelector('.item-lista.selected');
  let estaSelecionado = false;

  if (!selecionado || this.isSameNode(selecionado)) {
    this.classList.toggle('selected', !this.classList.contains('selected'));
    estaSelecionado = this.classList.contains('selected');
  } else if (selecionado) {
    selecionado.classList.remove('selected');
    this.classList.add('selected');
    estaSelecionado = true;
  }

  if (estaSelecionado) {
    btDeletar.dataset.id = this.dataset.id;
    form.dataset.id = this.dataset.id;
    submit.value = 'Atualizar';
  } else {
    delete btDeletar.dataset.id;
    delete form.dataset.id;
    submit.value = 'Cadastrar';
  }

  btDeletar.toggleAttribute('disabled', !estaSelecionado);
}

function listarPessoa(pessoa) {
  const itemDaLista = document.querySelector(`.item-lista[data-id="${pessoa.id}"]`);
  const li = itemDaLista || document.createElement('li');

  li.classList.add('item-lista');
  li.dataset.id = pessoa.id;

  const nomeIdade = document.createElement('span');
  nomeIdade.innerHTML = `${pessoa.nome}, ${pessoa.idade} anos,`

  const cidade = document.createElement('span');
  cidade.innerHTML = `residência em ${pessoa.cidade}`;

  if (!itemDaLista) {
    li.addEventListener('click', selecionarPessoa);
    li.append(nomeIdade, ' ', cidade);
    lista.appendChild(li);
  } else {
    li.innerHTML = '';
    li.append(nomeIdade, ' ', cidade);
  }
}

async function listar() {
  const pessoas = await fetch(`${apiUrl}/pessoas`, { method: 'GET' }).then((res) => res.json())
    .catch(() => alert('Ocorreu um erro ao listar as pessoas!'));

  pessoas.forEach(listarPessoa);
}

async function cadastrar(e) {
  e.preventDefault();

  const dados = {
    nome: this.dataset.nome,
    idade: Number(this.dataset.idade),
    cidade: this.dataset.cidade,
  }

  const inserirOuAtualizar =
    this.dataset.id
      ? [`${apiUrl}/pessoas/${this.dataset.id}`, { method: 'PUT', body: JSON.stringify(dados) }]
      : [`${apiUrl}/pessoas`, { method: 'POST', body: JSON.stringify(dados) }];

  const inseridoOuAtualizado = await fetch(...inserirOuAtualizar).then((res) => res.ok)
    .catch(() => alert('Ocorreu um erro no cadastro!'));

  if (inseridoOuAtualizado) {
    listar();
    iniciarForm();
    resetarSubmit();
  }

  if (this.dataset.id) {
    resetarBtDeletar();
    lista.querySelector(`.item-lista[data-id="${this.dataset.id}"]`).classList.remove('selected');
    delete this.dataset.id;
  }
}

async function deletar() {
  const deletado = fetch(`${apiUrl}/pessoas/${this.dataset.id}`, { method: 'DELETE' }).then((res) => res.ok)
    .catch(() => alert('Ocorreu um erro ao deletar o cadastro!'));

  if (deletado) {
    lista.querySelector(`.item-lista[data-id="${this.dataset.id}"]`).remove();
    resetarBtDeletar();
    resetarSubmit();
  }
}

form.querySelectorAll('#nome, #idade, #cidade')
  .forEach((input) => input.addEventListener('input', digitar))

form.addEventListener('submit', cadastrar);

btDeletar.addEventListener('click', deletar);

listar();
iniciarForm();

observer.observe(
  form,
  {
    attributes: true,
    attributeFilter: ['data-id', 'data-nome', 'data-idade', 'data-cidade']
  }
);
