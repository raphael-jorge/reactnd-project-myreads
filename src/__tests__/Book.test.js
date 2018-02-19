import React from 'react';
import {shallow} from 'enzyme';
import Book from '../components/Book';

const setup = propOverrides => {
  const props = Object.assign({
    bookData: {},
    onShelfUpdate: () => Promise.resolve(),
    availableBookshelves: [],
    onBookClick: undefined,
  }, propOverrides);

  const book = shallow(<Book {...props} />);

  const shelfChangeEventMock = {
    persist: () => {},
    target: {
      addEventListener: () => {},
      removeEventListener: () => {},
      value: 'value',
      parentNode: {
        classList: {
          add: () => {},
          remove: () => {}
        }
      }
    }
  };

  return {
    props,
    book,
    shelfChangeEventMock
  };
};

const testBookshelves = [
  {name: 'a', title: 'a'},
  {name: 'b', title: 'b'},
  {name: 'c', title: 'c'}
];


describe('<Book />', () => {

  it('renders without crashing', () => {
    // Livro sem dados
    const {book} = setup();
    expect(book.find('.book').length).toBe(1);
    expect(book.find('.book-cover-no-image').length).toBe(1);

    // Livro com dados disponíveis
    const shelf = 'testShelf';
    const bookData = {
      title: 'testTitle',
      imageLinks: {thumbnail: 'testImageURL'},
      authors: ['testAuthor'],
      shelf: shelf
    };
    book.setProps({bookData});

    expect(book.find('.book').length).toBe(1);
    expect(book.find('.book-cover-no-image').length).toBe(0);
    expect(book.find('.book-title').length).toBe(1);
    expect(book.find('.book-authors').length).toBe(1);
    expect(book.find('select').prop('value')).toBe(shelf);

  });


  it('renders all authors when more than one is provided', () => {
    const authors = ['testAuthor1', 'testAuthor2', 'testAuthor3'];
    const {book} = setup({bookData: {authors}});

    const renderedAuthors = book.find('.book-authors')
                                .map(renderedAuthor => renderedAuthor.text());

    expect(renderedAuthors.sort()).toEqual(authors.sort());
  });


  it('calls onBookClick when it is set and the book cover is clicked', () => {
    const onBookClick = jest.fn();
    const {book} = setup({onBookClick: onBookClick});

    book.find('.book-cover').simulate('click');
    expect(onBookClick).toHaveBeenCalled();
  });


  describe('shelf', () => {

    it('renders a select menu with the available bookshelves', () => {
      const {book} = setup({availableBookshelves: testBookshelves});

      const renderedOptions = book.find('.book-shelf-changer select option')
                                  .map(node => node.text());

      const bookshelfTitles = testBookshelves.map(bookshelf => bookshelf.title);

      expect(renderedOptions).toEqual(expect.arrayContaining(bookshelfTitles));
    });

    it('provides a method to prevent shelf change events to be triggered', () => {
      const event = {
        preventDefault: jest.fn()
      };

      Book.blockShelfChange(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('calls prop function onShelfUpdate when the shelf parameter changes', () => {
      const onShelfUpdate = jest.fn(() => Promise.resolve());
      const {book, shelfChangeEventMock} = setup({
        onShelfUpdate: onShelfUpdate,
        availableBookshelves: testBookshelves
      });

      book.find('.book-shelf-changer select').simulate('change', shelfChangeEventMock);

      expect(onShelfUpdate).toHaveBeenCalled();
    });

    it('calls book method onShelfChange when the shelf parameter changes', () => {
      const {book} = setup({availableBookshelves: testBookshelves});

      book.instance().onShelfChange = jest.fn();
      book.update();

      const eventMock = {persist: () => {}};
      book.find('.book-shelf-changer select').simulate('change', eventMock);

      expect(book.instance().onShelfChange).toHaveBeenCalled();
    });
  });
});
