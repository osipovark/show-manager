document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

class App {
  static showCount = 0;

  constructor() {
    this.showlists = [];
  }

  init() {
    this.showlists.push(new Showlist(this, 'plan-to-watch'));
    this.showlists.push(new Showlist(this, 'watching'));
    this.showlists.push(new Showlist(this, 'completed'));
    this.showlists.push(new Showlist(this, 'on-hold'));
    this.showlists.push(new Showlist(this, 'dropped'));

    this.render();

    /* On clicking "hamburger" menu icon */
    document.querySelector('.header__menu-icon')
      .addEventListener('click', (event) => {
        event.target.classList.toggle('_active');
        document.querySelector('.header__menu').classList.toggle('_active');
      });

    /* On clicking "Add show" button in menu */
    document.getElementById('add-show-button')
      .addEventListener('click', (event) => {
        let buttonAdd = document.getElementById('submit-show-button');
        let buttonChange = document.getElementById('change-show-button');
        if (buttonAdd.classList.contains('hidden')) {
          buttonAdd.classList.remove('hidden');
        }
        if (!buttonChange.classList.contains('hidden')) {
          buttonChange.classList.add('hidden');
        }
        event.target.parentElement.classList.remove('_active');
        document.querySelector('.header__menu-icon').classList.remove('_active');
        document.querySelector('.add-show-form').classList.add('_active');
        let title = document.getElementById('added-show-title');
        let description = document.getElementById('added-show-description');
        title.value = 'title';
        description.value = 'text';
      });

    /* On closing form */
    document.querySelector('.add-show-form__close-button')
      .addEventListener('click', (event) => {
        event.target.closest('.add-show-form').classList.remove('_active');
        let title = document.getElementById('added-show-title');
        let description = document.getElementById('added-show-description');
        let option = document.getElementById('added-show-list');
        title.value = 'title';
        description.value = 'text';
        option.value = 'plan-to-watch';
      });

    /* On submitting show */
    document.getElementById('submit-show-button')
      .addEventListener('click', () => {
        let title = document.getElementById('added-show-title');
        let description = document.getElementById('added-show-description');
        let option = document.getElementById('added-show-list');
        if (!title.value) {
          alert("Show has to have a title");
          title.focus();
          return;
        }
        const list = this.showlists.find((list) => list.listName === option.value);
        list.addShow(title.value, description.value, option.value);
        list.shows[list.shows.length - 1].renderShow();
        title.value = 'title';
        description.value = 'text';
        option.value = 'plan-to-watch';
      });
  }

  render() {
    const lists = document.querySelector('.lists');

    for (let showlist of this.showlists) {
      const list = document.createElement('section');
      list.classList.add('list');
      list.classList.add(`list--${showlist.listName}`);

      const title = document.createElement('h2');
      title.classList.add('list__title');
      title.innerHTML = capitalizeTitle(showlist.listName);

      const shows = document.createElement('div');
      shows.classList.add('shows');

      list.append(title);
      list.append(shows);

      lists.append(list);
    }
  }

  decrementSecondIndex(startIndex) {
    for (let list of this.showlists) {
      for (let show of list.shows) {
        const secondIndex = getSecondIndexFromId(show.Id);
        if (secondIndex > startIndex) {
          show.Id = generateId(list.listName, getFirstIndexFromId(show.Id), secondIndex - 1);
        }
      }
    }
  }

  decrementSecondIndexDOM(startIndex) {
    for (let list of this.showlists) {
      for (let show of list.shows) {
        const secondIndex = getSecondIndexFromId(show.Id);
        if (secondIndex > startIndex) {
          const newId = generateId(list.listName, getFirstIndexFromId(show.Id), secondIndex - 1);
          document.getElementById(`${show.Id}`).id = newId;
        }
      }
    }
  }
};

class Showlist {
  constructor(appRef, listName) {
    this.appRef = appRef;
    this.listName = listName;
    this.shows = [];
  }

  updateFirstIndex(startIndex) {
    let count = startIndex;
    this.shows.slice(startIndex + 1, this.shows.length).
      forEach((item) => {
        const newId = generateId(getListnameFromId(item.Id), count++, getSecondIndexFromId(item.Id));
        item.Id = newId;
      });
  }

  incrementFirstIndex() {
    this.shows.slice(1, this.shows.length).
      forEach((item) => {
        const newId = generateId(getListnameFromId(item.Id), getFirstIndexFromId(item.Id) + 1, getSecondIndexFromId(item.Id));
        item.Id = newId;
      });
  }

  updateFirstIndexDOM(startIndex) {
    let count = startIndex;
    this.shows.slice(startIndex + 1, this.shows.length).
      forEach((item) => {
        const newId = generateId(getListnameFromId(item.Id), count++, getSecondIndexFromId(item.Id));
        document.getElementById(`${item.Id}`).id = newId;
      });
  }

  incrementFirstIndexDOM() {
    this.shows.slice(1, this.shows.length).
      forEach((item) => {
        const newId = generateId(getListnameFromId(item.Id), getFirstIndexFromId(item.Id) + 1, getSecondIndexFromId(item.Id));
        document.getElementById(`${item.Id}`).id = newId;
      });
  }

  addShow(title, description) {
    const newShow = new Show(this, generateId(this.listName, this.shows.length), title, description);
    this.shows.push(newShow);
    App.showCount++;
  }
}

class Show {
  constructor(showlistRef, Id, title, description) {
    this.showlistRef = showlistRef;
    this.Id = Id;
    this.title = title;
    this.description = description;
  }

  renderShow(prepend = false) {
    const list = document.querySelector(`.list--${this.showlistRef.listName}`);

    if (!list.classList.contains('_active')) {
      list.classList.add('_active');
    }

    const shows = list.querySelector(`.shows`);

    const show = document.createElement('div');
    show.classList.add('show');
    show.id = this.Id;

    const title = document.createElement('h3');
    title.classList.add('show__title');
    title.innerHTML = this.title;

    const description = document.createElement('p');
    description.classList.add('show__description');
    description.innerHTML = this.description;

    const footer = document.createElement('footer');
    footer.classList.add('show__footer');

    const controls = document.createElement('div');
    controls.classList.add('show__controls');

    const editButton = document.createElement('button');
    editButton.classList.add('show__button');
    editButton.classList.add('edit');
    editButton.addEventListener('click', () => console.log('edit'));

    const leftArrowButton = document.createElement('button');
    leftArrowButton.classList.add('show__button');
    leftArrowButton.classList.add('left-arrow');
    leftArrowButton.addEventListener('click', () => this.onMoveLeft());

    const rightArrowButton = document.createElement('button');
    rightArrowButton.classList.add('show__button');
    rightArrowButton.classList.add('right-arrow');
    rightArrowButton.addEventListener('click', () => this.onMoveRight());

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('show__button');
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => this.onDeleteShow());

    controls.append(editButton);
    controls.append(leftArrowButton);
    controls.append(rightArrowButton);
    controls.append(deleteButton);

    footer.append(controls);

    show.append(title);
    show.append(description);
    show.append(footer);

    if (prepend) {
      shows.prepend(show);
    } else {
      shows.append(show);
    }
  }

  swapFirstIndexesDOM(fixed) {
    const movingElement = document.getElementById(this.Id);
    const fixedElement = document.getElementById(fixed.Id);
    const fromIndex = getFirstIndexFromId(this.Id);
    movingElement.id = generateId(this.showlistRef.listName, getFirstIndexFromId(fixed.Id), getSecondIndexFromId(this.Id));
    fixedElement.id = generateId(this.showlistRef.listName, fromIndex, getSecondIndexFromId(fixed.Id));
  }

  swapShows(fixed) {
    const fixedIndex = getFirstIndexFromId(fixed.Id);
    const movingIndex = getFirstIndexFromId(this.Id);
    if (fixedIndex < movingIndex) {
      this.showlistRef.shows.splice(fixedIndex, 2, ...this.showlistRef.shows.slice(fixedIndex, movingIndex + 1).reverse());
    } else {
      this.showlistRef.shows.splice(movingIndex, 2, ...this.showlistRef.shows.slice(movingIndex, fixedIndex + 1).reverse());
    }
  }

  swapFirstIndexes(fixed) {
    const movingIndex = getFirstIndexFromId(this.Id);
    this.Id = generateId(this.showlistRef.listName, getFirstIndexFromId(fixed.Id), getSecondIndexFromId(this.Id));
    fixed.Id = generateId(this.showlistRef.listName, movingIndex, getSecondIndexFromId(fixed.Id));
  }

  restoreEventListeners() {
    const show = document.getElementById(this.Id);

    show.querySelector('.edit').addEventListener('click', () => this.onEditShow());
    show.querySelector('.left-arrow').addEventListener('click', () => this.onMoveLeft());
    show.querySelector('.right-arrow').addEventListener('click', () => this.onMoveRight());
    show.querySelector('.delete').addEventListener('click', () => this.onDeleteShow());
  }

  putBefore(fixed) {
    const movingElement = document.getElementById(this.Id).cloneNode(true);
    const fixedElement = document.getElementById(fixed.Id);
    document.getElementById(this.Id).remove();
    fixedElement.before(movingElement);
  }

  moveLeft() {
    const fixedShow = this.showlistRef.shows[getFirstIndexFromId(this.Id) - 1];
    this.putBefore(fixedShow);
    this.swapFirstIndexesDOM(fixedShow);
    this.swapShows(fixedShow);
    this.swapFirstIndexes(fixedShow);
    this.restoreEventListeners();
  }

  isFirstInList() {
    return (getFirstIndexFromId(this.Id) === 0);
  }

  moveToPrevious() {
    const app = this.showlistRef.appRef;
    const fromShowlistIndex = app.showlists.findIndex(showlist => this.showlistRef === showlist);
    const fromShowlist = app.showlists[fromShowlistIndex];
    const toShowlist = app.showlists[fromShowlistIndex - 1];
    toShowlist.shows.push(fromShowlist.shows.shift());
    this.Id = generateId(toShowlist.listName, toShowlist.shows.length - 1, getSecondIndexFromId(this.Id));
    this.showlistRef = toShowlist;
  }

  onMoveLeft() {
    if (this.isFirstInList()) {
      this.eraseShow();
      this.moveToPrevious();
    } else {
      this.moveLeft();
    }
  }

  putAfter(fixed) {
    const movingElement = document.getElementById(this.Id).cloneNode(true);
    const fixedElement = document.getElementById(fixed.Id);
    document.getElementById(this.Id).remove();
    fixedElement.after(movingElement);
  }

  moveRight() {
    const fixedShow = this.showlistRef.shows[getFirstIndexFromId(this.Id) + 1];
    this.putAfter(fixedShow);
    this.swapFirstIndexesDOM(fixedShow);
    this.swapShows(fixedShow);
    this.swapFirstIndexes(fixedShow);
    this.restoreEventListeners();
  }

  isLastInList() {
    return (getFirstIndexFromId(this.Id) === (this.showlistRef.shows.length - 1));
  }

  moveToNext() {
    const app = this.showlistRef.appRef;
    const fromShowlistIndex = app.showlists.findIndex(showlist => this.showlistRef === showlist);
    const fromShowlist = app.showlists[fromShowlistIndex];
    const toShowlist = app.showlists[fromShowlistIndex + 1];
    toShowlist.shows.unshift(fromShowlist.shows.pop());
    this.Id = generateId(toShowlist.listName, 0, getSecondIndexFromId(this.Id));
    this.showlistRef = toShowlist;
  }

  onMoveRight() {
    if (this.isLastInList()) {
      this.eraseShow();
      this.moveToNext();
      this.showlistRef.incrementFirstIndexDOM();
      this.showlistRef.incrementFirstIndex();
      this.renderShow(true);
    } else {
      this.moveRight();
    }
  }

  eraseShow() {
    const list = document.querySelector(`.list--${getListnameFromId(this.Id)}`);
    document.getElementById(`${this.Id}`).remove();
    if (list.querySelectorAll('.shows .show').length === 0) {
      list.classList.remove('_active');
    }
  }

  deleteShow() {
    this.showlistRef.shows.splice(getFirstIndexFromId(this.Id), 1);
  }

  onDeleteShow() {
    this.showlistRef.updateFirstIndexDOM(getFirstIndexFromId(this.Id));
    this.showlistRef.updateFirstIndex(getFirstIndexFromId(this.Id));
    this.showlistRef.appRef.decrementSecondIndexDOM(getSecondIndexFromId(this.Id));
    this.showlistRef.appRef.decrementSecondIndex(getSecondIndexFromId(this.Id));
    this.eraseShow();
    this.deleteShow();
    App.showCount--;
  }
}

/* Utility functions */

function generateId(option, listIndex, index = App.showCount) {
  return `${option}_${listIndex}_${index}`;
}

function capitalizeTitle(words) {
  words = words.split('-');
  words[0] = words[0].slice(0, 1).toUpperCase() + words[0].slice(1);
  return words.join(' ');
}

function getListnameFromId(Id) {
  return Id.split('_')[0];
}

function getFirstIndexFromId(Id) {
  return Number(Id.split('_')[1]);
}

function getSecondIndexFromId(Id) {
  return Number(Id.split('_')[2]);
}