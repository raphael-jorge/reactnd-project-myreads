import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {mount, shallow} from 'enzyme';
import App from '../App';
import * as BooksAPI from '../BooksAPI';

jest.mock('../BooksAPI');
jest.mock('react-modal');

const setup = route => {
  const shallowApp = shallow(
    <MemoryRouter initialEntries={[route]} initialIndex={0}>
      <App />
    </MemoryRouter>
  ).find(App).dive();

  const mountedApp = mount(
    <MemoryRouter initialEntries={[route]} initialIndex={0}>
      <App />
    </MemoryRouter>
  );

  return {
    shallowApp,
    mountedApp,
  };
};

// Restaura o estado das mocks na api
afterEach(() => {
  BooksAPI.get.mockClear();
  BooksAPI.getAll.mockClear();
  BooksAPI.update.mockClear();
  BooksAPI.search.mockClear();
});

describe('<App />', () => {

  it('renders all pages without crashing', () => {
    let mountedApp;
    mountedApp = setup('/').mountedApp;
    expect(mountedApp.find('.app .list-books').length).toBe(1);

    mountedApp = setup('/search').mountedApp;
    expect(mountedApp.find('.app .search-books').length).toBe(1);
  });


  describe('loading', () => {

    it('it get books from api', () => {
      setup('/');
      expect(BooksAPI.getAll).toHaveBeenCalled();
    });

    it('set the loading state to true when books are requested to the api', () => {
      const app = setup('/').shallowApp;
      expect(app.state('loadingBooks')).toBe(true);
    });

    it('set the loading state to false once books are loaded from the api', () => {
      const app = setup('/').shallowApp;
      return Promise.resolve().then(() => {
        expect(app.state('loadingBooks')).toBe(false);
      });
    });

    it('set the loading state to false if an error occurs while reading books from the api', () => {
      BooksAPI.getAll.mockImplementationOnce(() => Promise.reject());
      const app = setup('/').shallowApp;

      return Promise.resolve().then(() => {}).then(() => {
        expect(app.state('loadingBooks')).toBe(false);
      });
    });

  });


  describe('App.updateShelfOnBook()', () => {

    it('updates the book data on the api', () => {
      const app = setup('/').shallowApp;
      const book = {id: 'testId'};
      const shelf = 'testShelf';

      app.instance().updateShelfOnBook(book, shelf);

      return Promise.resolve().then(() => {
        expect(BooksAPI.update).toHaveBeenCalledWith(book, shelf);
      });
    });

    it('update the shelf parameter of a book already stored in the books state', () => {
      const app = setup('/').shallowApp;
      const bookId = 'testId';
      const shelf = 'testShelf';
      const newShelf = 'testNewShelf';

      const book = {id: bookId, shelf: shelf};
      const updatedBook = {id: bookId, shelf: newShelf};

      // Adiciona o livro
      app.instance().updateShelfOnBook(book, shelf);
      // Atualiza o livro
      app.instance().updateShelfOnBook(book, newShelf);

      return Promise.resolve().then(() => {
        expect(app.state('books')).toEqual([updatedBook]);
      });
    });

    it('add an updated book to the books state if it is not stored yet', () => {
      const app = setup('/').shallowApp;
      const bookId = 'testId';
      const shelf = 'testShelf';

      const book = {id: bookId};
      const updatedBook = {id: bookId, shelf: shelf};

      app.instance().updateShelfOnBook(book, shelf);

      return Promise.resolve().then(() => {
        expect(app.state('books')).toEqual([updatedBook]);
      });
    });

    it('remove the book from the books state when the shelf parameter is set to none', () => {
      const app = setup('/').shallowApp;
      const bookId = 'testId';
      const shelf = 'testShelf';

      const book = {id: bookId, shelf: shelf};

      // Adiciona o livro com shelf != none
      app.instance().updateShelfOnBook(book, shelf);
      // Atualiza o livro com shelf = none
      app.instance().updateShelfOnBook(book, 'none');

      return Promise.resolve().then(() => {
        expect(app.state('books').length).toBe(0);
      });
    });

  });


  describe('modal parameters', () => {

    it('reset modal parameters once App.closeModal() is called', () => {
      const app = setup('/').shallowApp;
      app.setState({
        showModal: true,
        bookModal: {id: 'testId'}
      });

      app.instance().closeModal();

      expect(app.state('showModal')).toBe(false);
      expect(app.state('bookModal')).toEqual({});
    });

    it('set modal parameters once App.openModal() is called', () => {
      const app = setup('/').shallowApp;
      const bookData = {id: 'testId'};

      app.instance().openModal(bookData);

      expect(app.state('showModal')).toBe(true);
      expect(app.state('bookModal')).toEqual(bookData);
    });
  });

});
