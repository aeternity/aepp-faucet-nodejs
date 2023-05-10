import { generateKeyPair } from '@aeternity/aepp-sdk';
import fetch from 'cross-fetch';
import assert from 'assert';

const addresses = new Array(5).fill().map(() => generateKeyPair().publicKey);

await Promise.all(addresses.map(async address => {
    const request = await fetch(`http://localhost:5001/account/${address}`, { method: 'post' });
    assert.equal(request.status, 200);
    const data = await request.json();
    assert('tx_hash' in data);
    assert.equal(data.balance, '10000000000000000');
}));

console.log('It works');
