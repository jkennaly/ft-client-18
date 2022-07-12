//setupVitest.js or similar file
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';
import "fake-indexeddb/auto"
import "fake-local-storage"

const fetchMock = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks();

import { JSDOM } from "jsdom";
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
    // So we can get `requestAnimationFrame`
    pretendToBeVisual: true
});
global.window = Object.create(dom.window);
let _url = "http://dummy.com";

Object.defineProperty(window, 'location', {
    value: {
        href: _url,
        origin: _url,
        host: _url,
        hostname: _url,
        assign: (newUrl) => _url = newUrl,
    },
    writable: true,
    ennumerable: true,
    configurable: true
});

global.assignSpy = vi.spyOn(window.location, 'assign')
    .mockImplementation((newUrl) => _url = newUrl);

global.sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}




// Fill in the globals Mithril needs to operate. Also, the first two are often
// useful to have just in tests.
global.document = dom.window.document
global.requestAnimationFrame = dom.window.requestAnimationFrame
global.window.mockery = true
global.Headers = function () { }
global.API_URL = ''
global.BUILD_TIME = ''