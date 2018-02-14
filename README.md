# Projeto MyReads

Projeto final do curso **Fundamentos de React** do [Udacity](https://br.udacity.com/).

## Introdução

Uma _single page application_, criada com [React](https://reactjs.org/) e [React Router](https://reacttraining.com/react-router/), que interage com um servidor _backend_ permitindo selecionar e classificar livros entre:

  * Lendo (Currently Reading);
  * Quero Ler (Want to Read);
  * Já Li (Read).

O objetivo do projeto foi adicionar funcionalidades interativas à um _template_ inicial, estático, através da criação e integração de componentes React.

## Instalação e Inicialização

Para realizar a instalação das dependências do projeto é necessário ter o [Node](https://nodejs.org/en/) instalado em uma versão superior à versão 6.

  1. Clone o projeto com o [git](https://git-scm.com/):

      `git clone https://github.com/raphael-jorge/reactnd-project-myreads.git`

  2. Navegue até a pasta do projeto:

      `cd reactnd-project-myreads`

  3. Instale as dependências necessárias:

      `npm install`

  4. Inicialize a aplicação:

      `npm start`

  5. Uma nova janela deve ser aberta automaticamente no seu _browser_ após a inicialização da aplicação. Caso isso não ocorra, você pode acessa-la digitando a seguinte instrução na barra de endereços do seu browser:

      `localhost:3000`

## Funcionalidades

  * #### Exibição dos Livros

    A página principal da aplicação (_localhost:3000_) mostra os livros salvos em suas prateleiras. Cada livro conta com um controle que te permite trocar o livro de prateleira ou excluí-lo, selecionando a opção _None_.

  * #### Adição de Livros

    A partir da página inicial pode-se acessar a página de adição de livros (_localhost:3000/search_) por meio do botão de adição localizado no canto inferior direito da página.

    Na página de adição pode-se realizar uma pesquisa que retornará os livros encontrados no servidor que são compatíveis com o termo pesquisado. Esses livros podem ser adicionados a qualquer uma de suas prateleiras.

    **Importante**: Os termos de pesquisa que retornarão um conjunto de livros são limitados. Consulte o arquivo [SEARCH_TERMS.md](./SEARCH_TERMS.md) para saber quais são esses termos.

  * #### Detalhes do Livro

    Qualquer livro exibido na aplicação, quando recebe um clique em sua capa exibe uma janela com detalhes adicionais sobre o livro. Os detalhes exibidos dependem de cada livro, mas podem ser:

      - Uma descrição;
      - A editora;
      - A data de publicação;
      - O número de páginas;
      - A língua do livro;
      - As categorias do livro;
      - Um link para um site externo com mais informações sobre o livro exibido;
      - A prateleira em que o livro se encontra no momento (se estiver em alguma).

    Vale ressaltar que a mudança do livro de prateleira pode ser realizada nessa mesma janela.
