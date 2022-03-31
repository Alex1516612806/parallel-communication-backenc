/*
 * Test suite for login
 */
require('es6-promise').polyfill()
require('isomorphic-fetch')

const url = (path) => `http://localhost:3001${path}`
let cookie
describe('APP Test', () => {
  it('register new user', (done) => {
    let regUser = {
      username: 'testUser',
      password: '123',
      email: 'alex15166@outlook.com',
      zipcode: 77027,
      dob: 19990729,
    }
    fetch(url('/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regUser),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.result).toEqual('success')
        done()
      })
  })
  it('login user', (done) => {
    let loginUser = { username: 'testUser', password: '123' }
    fetch(url('/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginUser),
    })
      .then((res) => {
        cookie = res.headers.get('set-cookie')
        return res.json()
      })
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.result).toEqual('success')
        done()
      })
  })
  it('GetHeadline', (done) => {
    fetch(url('/headline'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.headline).toEqual('Happy')
        done()
      })
  })
  it('GetHeadlineWithUsername', (done) => {
    fetch(url('/headline/test2'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        expect(res.username).toEqual('test2')
        expect(res.headline).toEqual('This is test2 headline')
        done()
      })
  })
  it('PutHeadline', (done) => {
    let loginUser = { headline: 'Newly updated headline' }
    fetch(url('/headline'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
      body: JSON.stringify(loginUser),
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.headline).toEqual('Newly updated headline')
        done()
      })
  })
  it('Post Article', (done) => {
    let msg = { text: 'This is the article post test' }
    fetch(url('/article'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
      body: JSON.stringify(msg),
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        expect(res.articles[0].author).toEqual('testUser')
        expect(res.articles[0].body).toEqual('This is the article post test')
        expect(res.articles[0].comments.length).toEqual(0)
        done()
      })
  })
  it('GetArticle', (done) => {
    fetch(url('/articles'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        expect(res.articles.length).toNotEqual(0)
        done()
      })
  })
  it('GetArticleWithId', (done) => {
    fetch(url('/articles/2'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        expect(res.articles.length).toEqual(1)
        expect(res.articles[0].articleId).toEqual(2)
        done()
      })
  })
  it('Logout', (done) => {
    fetch(url('/logout'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', cookie: cookie },
      body: JSON.stringify(),
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        // Check cookie has been clearned
        expect(typeof res.cookie).toEqual('undefined')
        expect(res).toEqual('OK')
        done()
      })
  })
})
