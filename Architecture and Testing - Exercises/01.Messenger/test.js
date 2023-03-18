const { chromium } = require('playwright-chromium')
const { expect } = require('chai')
const host = `http://127.0.0.1:5500/01.Messenger/index.html`;

describe('Tests', async function () {
    this.timeout(10000);
    let browser, page;

    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 1000 });

    });
    after(async () => {
        await browser.close();
    })
    beforeEach(async () => {
        page = await browser.newPage();
    })
    afterEach(async () => {
        page.close();
    })
    it('load all messages', async () => {

        await page.goto(host);
        await page.click('text=Refresh');
        const rowData = await page.$$eval('textarea', rows => rows.map(r => r.value));
        expect(rowData[0]).to.contains('Spami:');
        expect(rowData[0]).to.contains('Garry');
        expect(rowData[0]).to.contains('How are you? Long time no see? :)');
        expect(rowData[0]).to.contains('Hello, George nice to see you! :)))');

    });
    it('send message', async () => {
        await page.goto(host);

        await page.fill('#author','Title');
        await page.fill('#content','Something to write');

        const [request] = await Promise.all([
            page.waitForRequest((request)=>request.method()=='POST'),
            page.click('text=Send')
        ]);
        const data = JSON.parse(request.postData());

       expect(data.author).to.equal('Title');
       expect(data.content).to.equal('Something to write');

    });

})