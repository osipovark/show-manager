document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

class App {
  init() {
    document.querySelector('.header__menu-icon')
      .addEventListener('click', (event) => {
        event.target.classList.toggle('_active');
        document.querySelector('.header__menu').classList.toggle('_active');
      });
  }
};