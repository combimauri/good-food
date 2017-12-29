import { AppPage } from './app.po';

<<<<<<< HEAD
describe('good-food-admin App', () => {
=======
describe('good-food-two App', () => {
>>>>>>> 594e447c85ee1a41f293f6220764c98ff946611c
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to food!');
  });
});
