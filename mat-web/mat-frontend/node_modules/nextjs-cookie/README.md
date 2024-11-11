
<h1 align="center">Next.Js Cookies (nextjs-cookie)</h1>
<p align="center">Set, Delete, Update Cookies</p>
<p align="center">
<a href="https://www.npmjs.com/package/nextjs-cookie">
  <img src="https://img.shields.io/npm/dm/nextjs-cookie.svg?style=flat-square" alt="NPM downloads">
</a>
<a href="https://www.npmjs.com/package/nextjs-cookie">
    <img src="https://img.shields.io/npm/v/nextjs-cookie.svg?style=flat-square" alt="NPM version">
</a>
<a href="https://github.com/nicholidev/nextjs-cookie/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/nextjs-cookie.svg?style=flat-square" alt="License">
</a>
</p>


## How to use

### Install
```
npm install nextjs-cookie
```
or 
```
yarn add nextjs-cookie
```


### Set cookie
```js
import { setCookie } from 'nextjs-cookie';

setCookie('key', 'value', options);
```

### Read Cookie
```js
import { getCookie } from 'nextjs-cookie';

const keyCookie = getCookie('key', options);

// If no cookie, [key] will be undefined 
```

### Read all cookies
```js
import { getCookies } from 'nextjs-cookie';

const cookies = getCookies(options);

/*
The [cookies] will be
{
  key: "value",
  key1: "value1"
  ...
}
*/
```

### Check cookie exists
```js
import { hasCookie } from 'nextjs-cookie';

const cookieExists = hasCookie('name', options);

// [cookieExists] is [true] or [false]
```

### Delete Cookie
```js
import { deleteCookie } from 'nextjs-cookie';

deleteCookie(name, options);
```
<b>!IMPORTANT</b>

When deleting a cookie and you're not relying on the default attributes, you must pass the exact same path and domain attributes that were used to set the cookie:

```js
import { deleteCookie } from 'nextjs-cookie';

deleteCookie(name, { path: '/path', domain: '.yourdomain.com' });
```

## Client & Server Side Rendering(SSR)

If you pass Next.js context(ctx) in function, then this function will be done on both client and server

If the function should be done only on client or can't get ctx, pass null or {}
as the first argument to the function and when server side rendering, this function `return undefined;`


### Client Side Example

```js
import { getCookies, setCookie, deleteCookie } from 'nextjs-cookie';

getCookies();
getCookie('key');
setCookie('key', 'value');
deleteCookie('key');
```

### Server Side Rendering Example

`/page/index.js`

```jsx
import React from 'react';
import { getCookies, getCookie, setCookie, deleteCookie } from 'nextjs-cookie';

const Home = () => {
  return <div>page content</div>;
};

export const getServerSideProps = ({ req, res }) => {
  setCookie('test', 'value', { req, res, maxAge: 60 * 6 * 24 });
  getCookie('test', { req, res });
  getCookies({ req, res });
  deleteCookie('test', { req, res });

  return { props: {} };
};

export default Home;
```

### API Example

`/page/api/example.js`

```js
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookies, getCookie, setCookie, deleteCookie } from 'nextjs-cookie';

export default async function handler(req, res) {
  setCookie('server-key', 'value', { req, res, maxAge: 60 * 60 * 24 });
  getCookie('key', { req, res });
  getCookies({ req, res });
  deleteCookie('key', { req, res });

  return res.status(200).json({ message: 'ok' });
}
```

## API

### setCookie(key, value, options);

```js
setCookie('key', 'value', options);

setCookie('key', 'value'); // - client side
setCookie('key', 'value', { req, res }); // - server side
```

### getCookies(options);

```js
getCookies(); // - client side
getCookies({ req, res }); // - server side
```

### getCookie(key, options);

```js
getCookie('key'); - client side
getCookie('key', { req, res }); - server side
```

### hasCookie(key, options);

```js
hasCookie('key'); // - client side
hasCookie('key', { req, res }); // - server side
```

### deleteCookie(key, options);

```js
deleteCookie('key'); // - client side
deleteCookie('key', { req, res }); // - server side
```

<b>!IMPORTANT</b>

When deleting a cookie and you're not relying on the default attributes,
you must pass the exact same path and domain attributes that were used to set the cookie:

```js
deleteCookie(ctx, name, { path: '/path', domain: '.yourdomain.com' });  - client side
deleteCookie(ctx, name, { req, res, path: '/path', domain: '.yourdomain.com' }); - server side
```

## Variables & Keys

#### key

cookie's name

#### value

cookie's value

#### options:

##### req

required for server side cookies (API and getServerSideProps)

##### res

required for server side cookies (API and getServerSideProps)

##### domain

Specifies the value for the [`Domain` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3). By default, no
domain is set, and most clients will consider the cookie to apply to only the current domain.

##### encode

Specifies a function that will be used to encode a cookie's value. Since value of a cookie
has a limited character set (and must be a simple string), this function can be used to encode
a value into a string suited for a cookie's value.

The default function is the global `encodeURIComponent`, which will encode a JavaScript string
into UTF-8 byte sequences and then URL-encode any that fall outside of the cookie range.

##### expires

A `Date` object indicating the cookie's expiration date

By default, no expiration is set, and most clients will consider this a "non-persistent cookie" and
will delete it on a condition like exiting a web browser application.

**note** the [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and
`maxAge` are set, then `maxAge` takes precedence, but it is possible not all clients by obey this,
so if both are set, they should point to the same date and time.

##### httpOnly

Specifies the `boolean` value for the [`HttpOnly` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.6). When truthy,
the `HttpOnly` attribute is set, otherwise it is not. By default, the `HttpOnly` attribute is not set.

**note** be careful when setting this to `true`, as compliant clients will not allow client-side
JavaScript to see the cookie in `document.cookie`.

##### maxAge

Specifies the `number` (in seconds) to be the value for the [`Max-Age` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.2).
The given number will be converted to an integer by rounding down. By default, no maximum age is set.

**note** the [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and
`maxAge` are set, then `maxAge` takes precedence, but it is possible not all clients by obey this,
so if both are set, they should point to the same date and time.

##### path

Specifies the value for the [`Path` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4). By default, the path
is considered the ["default path"](https://tools.ietf.org/html/rfc6265#section-5.1.4).

##### sameSite

Specifies the `boolean` or `string` to be the value for the [`SameSite` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7).

- `true` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
- `false` will not set the `SameSite` attribute.
- `'lax'` will set the `SameSite` attribute to `Lax` for lax same site enforcement.
- `'none'` will set the `SameSite` attribute to `None` for an explicit cross-site cookie.
- `'strict'` will set the `SameSite` attribute to `Strict` for strict same site enforcement.

More information about the different enforcement levels can be found in
[the specification](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7).

**note** This is an attribute that has not yet been fully standardized, and may change in the future.
This also means many clients may ignore this attribute until they understand it.

##### secure

Specifies the `boolean` value for the [`Secure` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5). When truthy,
the `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.

**note** be careful when setting this to `true`, as compliant clients will not send the cookie back to
the server in the future if the browser does not have an HTTPS connection.

## License

[MIT](https://github.com/nicholidev/nextjs-cookie/blob/main/LICENSE)

## Author
[Nicholi Jin](https://nicholijin.com)