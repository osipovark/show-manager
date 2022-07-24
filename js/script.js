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
};

class Showlist {
  constructor(appRef, listName) {
    this.appRef = appRef;
    this.listName = listName;
    this.shows = [];
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
    leftArrowButton.addEventListener('click', () => console.log('left arrow'));

    const rightArrowButton = document.createElement('button');
    rightArrowButton.classList.add('show__button');
    rightArrowButton.classList.add('right-arrow');
    rightArrowButton.addEventListener('click', () => console.log('right arrow'));

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

  eraseShow() {
    const listname = this.Id.split('_')[0];
    const list = document.querySelector(`.list--${listname}`);
    document.getElementById(`${this.Id}`).remove();
    if (list.querySelectorAll('.shows .show').length === 0) {
      list.classList.add('hidden');
    }
  }

  onDeleteShow() {
    this.eraseShow();
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