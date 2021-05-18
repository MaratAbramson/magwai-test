new Vue ({
  el: "#cards",
  data() {
    return {
      posts: [],
      pageCount: 1,
      imageBaseUrl: 'https://picsum.photos/300/200?random=',
    };
  },

  async mounted() {
    this.posts = await request('/posts?_limit=6&_page=1')
    console.log(this.posts)
    this.pageCount++
  },

  methods: {
    async getMoreCards(event) {
      const baseCardsUrl = '/posts?_limit=6&_page='
      const moreCardsUrl = baseCardsUrl + this.pageCount
      const moreCards = await request(moreCardsUrl)
      this.posts.push.apply(this.posts, moreCards)
      
      this.pageCount++
      console.log(this.pageCount)
      console.log(this.posts)
    }
  },
});

async function request(url, method = 'GET', data = null) {
  try {
    const baseUrl = 'https://jsonplaceholder.typicode.com'
    const reqUrl = baseUrl + url
    const headers = {}
    let body

    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }

    const response = await fetch(reqUrl, {
      method,
      headers,
      body
    })
    return await response.json()
  }
  catch (e) {
    console.warn('Error:', e.message)
  }
} 