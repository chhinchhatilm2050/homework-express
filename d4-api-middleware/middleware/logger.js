import morgan from 'morgan';
const requestLogger = morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined');
const startupLog = (port, env) => {
    console.log(`Server running on port ${port} [${env}]`);
    console.log(`Startde: ${new Date().toISOString()}`);
}

export { requestLogger, startupLog };