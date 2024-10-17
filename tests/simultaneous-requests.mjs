import { MemoryAccount } from '@aeternity/aepp-sdk';
import assert from 'assert';

const addresses = new Array(5).fill().map(() => MemoryAccount.generate().address);

await Promise.all(
  addresses.map(async (address) => {
    const request = await fetch(`http://localhost:5001/account/${address}`, { method: 'post' });
    assert.equal(request.status, 200);
    const data = await request.json();
    assert('tx_hash' in data);
    assert.equal(data.balance, '10000000000000000');
  }),
);

console.log('It works');
