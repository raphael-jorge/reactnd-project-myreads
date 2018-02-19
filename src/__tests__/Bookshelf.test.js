import React from 'react';
import {shallow} from 'enzyme';
import Bookshelf from '../components/Bookshelf';

const setup = propOverrides => {
  const props = Object.assign({
    title: '',
    books: [],
    onShelfUpdate: () => Promise.resolve(),
    availableBookshelves: [],
  }, propOverrides);

  const bookshelf = shallow(<Bookshelf {...props} />);

  return {
    props,
    bookshelf
  };
};

describe('<Bookshelf />', () => {

  it('renders without crashing', () => {
    const {bookshelf} = setup();
    expect(bookshelf.find('.bookshelf').length).toBe(1);
  });

  it('renders a title', () => {
    const testTitle = 'testTitle';
    const {bookshelf} = setup({title: testTitle});
    expect(bookshelf.find('.bookshelf-title').text()).toBe(testTitle);
  });

  it('renders a ListBooks component', () => {
    const {bookshelf} = setup();
    expect(bookshelf.find('ListBooks').length).toBe(1);
  });
});
