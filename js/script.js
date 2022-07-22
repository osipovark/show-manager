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