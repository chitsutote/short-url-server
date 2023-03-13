import app from './app';
import appDataSource from './appDataSource';

const PORT:number = Number(process.env.PORT) || 3000;

appDataSource.initialize()
  .then(() => {
    app.listen(PORT);
  })
  .catch(error => console.log('db error', error));
