const { chromium } = require('playwright-chromium')
const { expect } = require('chai')
const host = `http://127.0.0.1:5500/02.Book-Library/index.html`;

describe('Tests',async function(){
    this.timeout(6000);
    let browser,page;

    before(async () => {
        browser = await chromium.launch({headless:false,slowMo:1000});

    });
    after(async()=>{
        await browser.close();
    })
    beforeEach(async()=>{
        page=await browser.newPage();
    })
    afterEach(async()=>{
        page.close();
    })
    it('loads all books',async()=>{
        await page.goto(host);
        await page.click('text=Load all books');
        await page.waitForSelector('text=Harry Potter');
        
        const rowData = await page.$$eval('tbody tr',rows=>rows.map(r=>r.textContent));
        expect(rowData[0]).to.contains('Harry Potter');
        expect(rowData[0]).to.contains('Rowling');
        expect(rowData[1]).to.contains('C# Fundamentals');
        expect(rowData[1]).to.contains('Nakov');

    })
    
})