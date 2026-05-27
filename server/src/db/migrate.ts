import { migrate } from './index.js';

console.log('Running migrations...');
await migrate();
console.log('Migrations complete.');
