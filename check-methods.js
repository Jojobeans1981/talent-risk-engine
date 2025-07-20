import { TalentRiskEngine } from './src/index.js';

const engine = new TalentRiskEngine();
await engine.initialize();

console.log('Available methods:');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(engine)));
console.log('\nTrying to find analyze methods:');
Object.getOwnPropertyNames(Object.getPrototypeOf(engine)).forEach(method => {
  if (method.includes('analyze')) {
    console.log(`Found: ${method}`);
  }
});