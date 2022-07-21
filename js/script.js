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
  }

  render() {
    console.log("render");
  }
};

class Showlist {
  constructor(appRef, listName) {
    this.appRef = appRef;
    this.listName = listName;
    this.shows = [];
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