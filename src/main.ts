import { App } from './express/server';

const app = new App();
app.listen(8080);

process.on('exit', (code) => {
    console.log(`About to exit with code : ${code}`);
    app.exit();
});

process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    process.exit();
});
