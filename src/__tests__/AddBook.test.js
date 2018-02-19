import React from 'react';
import {shallow} from 'enzyme';
import AddBook from '../components/AddBook';
import * as BooksAPI from '../BooksAPI';

jest.mock('../BooksAPI');

const setup = propOverrides => {
  const props = Object.assign({
    books: [],
    bookshelves: [],
    onShelfUpdate: () => {},
    listBooksPath: '',
    onModalOpen: undefined,
    onModalClose: undefined,
    isModalOpen: undefined,
    bookModal: undefined
  }, propOverrides);

  const addBook = shallow(<AddBook {...props} />);
  addBook.instance().DEBOUNCE_TIME = 0;

  const timerTime = 50;

  const triggerChange = value => {
    const event = {target: {value}};
    const element = addBook.find('input[type="text"]');
    element.simulate('change', event);
  };

  return {
    props,
    addBook,
    timerTime,
    triggerChange
  };
};

afterEach(() => {
  BooksAPI.get.mockClear();
  BooksAPI.getAll.mockClear();
  BooksAPI.update.mockClear();
  BooksAPI.search.mockClear();
});


describe('<AddBook />', () => {

  it('renders an input to search for books', () => {
    const {addBook} = setup();
    expect(addBook.find('input[type="text"]').length).toBe(1);
  });


  it('renders a Link component to the listBooksPath prop', () => {
    const linkPath = '/';
    const {addBook} = setup({listBooksPath: linkPath});
    expect(addBook.find('Link').prop('to')).toBe(linkPath);
  });


  it('renders a ListBooks component to show the query results', () => {
    const {addBook} = setup();
    expect(addBook.find('ListBooks').length).toBe(1);
  });


  describe('query', () => {

    it('update the query state once the input value changes', () => {
      const {addBook, triggerChange, timerTime} = setup();

      const queryValue = 'testQuery';
      triggerChange(queryValue);
      expect(addBook.state('query')).toBe(queryValue);

      return new Promise(resolve => setInterval(() => resolve(), timerTime));
    });

    it('calls (delayed) BooksAPI.search() method if the input value changes', () => {
      const {triggerChange, timerTime} = setup();

      const queryValue = 'testQuery';
      triggerChange(queryValue);

      return new Promise((resolve, reject) => {
        setInterval(() => resolve(), timerTime);
      }).then(() => {
        expect(BooksAPI.search).toHaveBeenCalled();
      });
    });

    it('calls (delayed) BooksAPI.search() method only once on multiple input changes', () => {
      const {triggerChange, timerTime} = setup();

      const changesToSimulate = 5;
      let queryValue = '';
      for (let i = 0; i < changesToSimulate; i++) {
        queryValue += i.toString();
        triggerChange(queryValue);
      }

      return new Promise(resolve => {
        setInterval(() => resolve(), timerTime);
      }).then(() => {
        expect(BooksAPI.search).toHaveBeenCalledTimes(1);
      });
    });

    it('set the querying state to true once the input value changes', () => {
      const {addBook, triggerChange, timerTime} = setup();

      const queryValue = 'testQuery';
      triggerChange(queryValue);
      expect(addBook.state('querying')).toBe(true);

      return new Promise(resolve => setInterval(() => resolve(), timerTime));
    });

    it('set querying and queriedBooks states once query succeeds', () => {
      // Configura a api para retornar um livro
      const books = [{id: 'testBook', shelf: 'none'}];
      BooksAPI.search.mockImplementationOnce(() => Promise.resolve(books));

      const {addBook, triggerChange, timerTime} = setup();

      // Dispara o evento change
      const queryValue = 'testQuery';
      triggerChange(queryValue);

      return new Promise(resolve => {
        setInterval(() => resolve(), timerTime);
      }).then(() => {
        expect(addBook.state('querying')).toBe(false);
        expect(addBook.state('queriedBooks')).toEqual(books);
      });
    });

    it('set querying and queriedBooks states once query fails', () => {
      // Configura a api para retornar um erro
      BooksAPI.search.mockImplementation(() => Promise.reject());

      const {addBook, triggerChange, timerTime} = setup();

      // Dispara o evento change
      const queryValue = 'testQuery';
      triggerChange(queryValue);

      return new Promise(resolve => {
        setInterval(() => resolve(), timerTime);
      }).then(() => {
        expect(addBook.state('querying')).toBe(false);
        expect(addBook.state('queriedBooks')).toEqual([]);
      });
    });

    it('set querying and queriedBooks states if the query value is empty', () => {
      const {addBook, triggerChange, timerTime} = setup();

      // Configura um query state
      addBook.setState({query: 'testQuery'});

      // Anula o valor do input
      triggerChange('');

      expect(addBook.state('querying')).toBe(false);
      expect(addBook.state('queriedBooks')).toEqual([]);

      return new Promise(resolve => setInterval(() => resolve(), timerTime));
    });
  });


  describe('queried books', () => {

    it('synchronize shelf parameter on queriedBooks with the books prop', () => {
      const book = {id: '1'};

      // Configura a api para retornar um livro sem o parametro shelf
      BooksAPI.search.mockImplementationOnce(() => Promise.resolve([book]));

      // Inicializa o addBook com o mesmo livro, porém com o parametro shelf determinado
      book.shelf = 'testShelf';
      const {addBook, triggerChange, timerTime} = setup({books: [book]});

      // Dispara o evento de mudança para pesquisar o livro na api
      triggerChange('testValue');

      return new Promise(resolve => {
        setInterval(() => resolve(), timerTime);
      }).then(() => {
        expect(addBook.state('queriedBooks')).toEqual([book]);
      });
    });

    it('create a shelf parameter on queriedBooks if no book matching is found', () => {
      const queriedBooksNoShelf = [
        {id: 'noMatch1'},
        {id: 'noMatch2'}
      ];

      // Configura a api para retornar livros sem o parametro shelf
      BooksAPI.search.mockImplementationOnce(() => Promise.resolve(queriedBooksNoShelf));

      // O estado esperado dos livros retornados pela api depois de configurados
      const queriedBooksShelfSet = queriedBooksNoShelf.map(book => {
        book.shelf = 'none';
        return book;
      });

      const {addBook, triggerChange, timerTime} = setup();

      // Dispara o evento de mudança
      triggerChange('testValue');

      return new Promise(resolve => {
        setInterval(() => resolve(), timerTime);
      }).then(() => {
        expect(addBook.state('queriedBooks')).toEqual(queriedBooksShelfSet);
      });
    });

    it('update queriedBooks state once the set onShelfUpdate is called', () => {
      const bookId = '1';
      const bookInitialShelf = 'testShelf';
      const bookNewShelf = 'newTestShelf';

      // Cria os livros: um inicial e outro com a configuração final esperada
      const book = {id: bookId, shelf: bookInitialShelf};
      const updatedBook = {id: bookId, shelf: bookNewShelf};

      // método onShelfUpdate
      const onShelfUpdate = (bookData, newShelf) => {
        book.shelf = newShelf;
        return Promise.resolve();
      };

      // Instancia o addBook sem queriedBooks
      const {addBook} = setup();

      // Configura o método addBook.setShelfOnBooks() para retornar updatedBook
      addBook.instance().setShelfOnBooks = jest.fn(() => [updatedBook]);

      // Configura e invoca a função onShelfUpdate
      const newShelfUpdate = addBook.instance().setShelfUpdate(onShelfUpdate);
      newShelfUpdate(book, bookNewShelf);

      return Promise.resolve().then(() => {
        expect(addBook.state('queriedBooks')).toEqual([updatedBook]);
      });
    });
  });


  it('renders a modal when every necessary parameter is provided', () => {
    const {addBook} = setup();

    // Nenhum parâmetro configurado
    expect(addBook.find('BookModal').length).toBe(0);

    addBook.setProps({onModalOpen: () => {}});
    expect(addBook.find('BookModal').length).toBe(0);

    addBook.setProps({onModalClose: () => {}});
    expect(addBook.find('BookModal').length).toBe(0);

    addBook.setProps({isModalOpen: false});
    expect(addBook.find('BookModal').length).toBe(0);

    // Último parâmetro a ser configurado
    addBook.setProps({bookModal: {}});
    expect(addBook.find('BookModal').length).toBe(1);
  });


  it('use method setShelfUpdate on prop onShelfUpdate to keep data synchronized', () => {
    const {addBook} = setup();
    const testFunction = () => {};
    addBook.instance().setShelfUpdate = jest.fn(() => testFunction);
    addBook.setProps({
      onModalOpen: () => {},
      onModalClose: () => {},
      isModalOpen: true,
      bookModal: {},
    });
    expect(addBook.find('BookModal').prop('onShelfUpdate')).toBe(testFunction);
    expect(addBook.find('ListBooks').prop('onShelfUpdate')).toBe(testFunction);
  });
});
