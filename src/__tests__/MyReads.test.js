import React from 'react';
import {shallow} from 'enzyme';
import MyReads from '../components/MyReads';

const setup = propOverrides => {
  const props = Object.assign({
    books: [],
    bookshelves: [],
    onShelfUpdate: () => {},
    addBookPath: '',
    onModalOpen: undefined,
    onModalClose: undefined,
    isModalOpen: undefined,
    bookModal: undefined
  }, propOverrides);

  const myReads = shallow(<MyReads {...props} />);

  return {
    props,
    myReads
  };
};

const testBookshelves = [
  {title: 'testTitle1', name: 'testName1'},
  {title: 'testTitle2', name: 'testName2'},
  {title: 'testTitle3', name: 'testName3'},
];


describe('<MyReads />', () => {

  it('renders without crashing', () => {
    const {myReads} = setup();
    expect(myReads.find('.list-books').length).toBe(1);
  });


  it('renders one Bookshelf component for each bookshelf provided', () => {
    const {myReads} = setup({bookshelves: testBookshelves});
    expect(myReads.find('Bookshelf').length).toBe(testBookshelves.length);
  });


  it('assign each book to the correct bookshelf', () => {
    // Cria as arrays: books e booksFilteredByShelf
    const booksQtyByShelf = [2, 3, 5];
    const booksFilteredByShelf = [[], [], []];
    const books = [];
    let bookId = 0;
    // Para cada quantidade [i] em booksQtyByShelf cira um livro na prateleira testBookshelves[i]
    // O livro criado é armazenado:
    //   1) Na array de livros books
    //   2) Na array booksFilteredByShelf[i]
    booksQtyByShelf.forEach((n, idx) => {
      for (let i = 0; i < n; i++) {
        const bookData = {
          id: bookId++,
          shelf: testBookshelves[idx].name
        };
        books.push(bookData);
        booksFilteredByShelf[idx].push(bookData);
      }
    });

    // Instancia MyReads com os livros criados e as testBookshelves
    const {myReads} = setup({
      books: books,
      bookshelves: testBookshelves
    });

    const renderedBookshelves = myReads.find('Bookshelf');

    // Pra cada prateleira idx...
    testBookshelves.forEach((testBookshelf, idx) => {
      // A correspondente prateleira renderizada é selecionada...
      const matchingRenderedBookshelf = renderedBookshelves.findWhere(renderedBookshelf => {
        return renderedBookshelf.prop('title') === testBookshelf.title;
      });
      // E verifica-se se os livros nessa prateleira são os esperados em booksFilteredByShelf[idx]
      expect(matchingRenderedBookshelf.prop('books')).toEqual(booksFilteredByShelf[idx]);
    });
  });


  it('renders a modal when every necessary parameter is provided', () => {
    const {myReads} = setup();

    // Nenhum parâmetro configurado
    expect(myReads.find('BookModal').length).toBe(0);

    myReads.setProps({onModalOpen: () => {}});
    expect(myReads.find('BookModal').length).toBe(0);

    myReads.setProps({onModalClose: () => {}});
    expect(myReads.find('BookModal').length).toBe(0);

    myReads.setProps({isModalOpen: false});
    expect(myReads.find('BookModal').length).toBe(0);

    // Último parâmetro a ser configurado
    myReads.setProps({bookModal: {}});
    expect(myReads.find('BookModal').length).toBe(1);
  });


  it('renders a Link component to the addBookPath prop', () => {
    const linkPath = '/search';
    const {myReads} = setup({addBookPath: linkPath});
    expect(myReads.find('Link').prop('to')).toBe(linkPath);
  });

});
