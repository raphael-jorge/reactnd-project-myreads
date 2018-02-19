import React from 'react';
import {shallow} from 'enzyme';
import ListBooks from '../components/ListBooks';

const setup = propOverrides => {
  const props = Object.assign({
    books: [],
    onShelfUpdate: () => Promise.resolve(),
    availableBookshelves: [],
    onBookClick: undefined,
    loadingBooks: undefined,
    noBooksMessage: undefined
  }, propOverrides);

  const list = shallow(<ListBooks {...props} />);

  return {
    props,
    list
  };
};

const booksTest = [{id: '1'}, {id: '2'}, {id: '3'}];


describe('<ListBooks />', () => {

  it('renders a list of Book components', () => {
    const {list} = setup({books: booksTest});
    expect(list.find('li Book').length).toBe(booksTest.length);
  });

  it('renders only a loading icon if, and only if, loadingBooks is true', () => {
    const {list} = setup({loadingBooks: false});

    expect(list.find('li').length).toBe(0);

    // loadingBooks true, sem mensagem e sem livros
    list.setProps({loadingBooks: true});
    expect(list.find('li').length).toBe(1);
    expect(list.find('li').hasClass('loading')).toBe(true);

    // loadingBooks true, com mensagem e sem livros
    list.setProps({noBooksMessage: 'noBooksMessageTest'});
    expect(list.find('li').length).toBe(1);
    expect(list.find('li').hasClass('loading')).toBe(true);
    expect(list.find('li').hasClass('no-books')).toBe(false);

    // loadingBooks true, com mensagem e com livros
    list.setProps({books: booksTest});
    expect(list.find('Book').length).toBe(0);
    expect(list.find('li').length).toBe(1);
    expect(list.find('li').hasClass('loading')).toBe(true);
    expect(list.find('li').hasClass('no-books')).toBe(false);
  });

  it('renders an error message if one is provided and no books are given', () => {
    const errorMsg = 'errorMessageTest';
    const {list} = setup();

    // Sem livros, sem mensagem
    expect(list.find('li.no-books').length).toBe(0);

    // Sem livros, com mensagem
    list.setProps({noBooksMessage: errorMsg});
    expect(list.find('li.no-books').length).toBe(1);
    expect(list.find('li.no-books').text()).toBe(errorMsg);

    // Com livros, com mensagem
    list.setProps({books: booksTest});
    expect(list.find('li.no-books').length).toBe(0);
  });
});
