document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

class App {
  init() {

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
  }
};