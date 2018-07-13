require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const franc = require('franc')
const translate = require("baidu-translate-api");

const r = new Snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

const client = new Snoostorm(r);

const streamOpts = {
  subreddit: 'testingground4bots+china+shanghai',
  results: 25
};

const comments = client.CommentStream(streamOpts);

comments.on('comment', (comment) => {
  // Translate fully Chinese comments
  if (franc(comment.body, {minLength: 1}) == 'cmn' && comment.author.name !== 'chinese_to_english') {
    console.log(new Date().toLocaleString() + ' | Translating full comment ... ')
    translate(comment.body).then(response => {
      setTimeout(comment.reply(
// Left-aligned to avoid Reddit autoformatting as code block
`**Translation:** ${response.trans_result.dst}

**Original Text:** ${response.trans_result.src}

---

*I'm automated. View my profile for more info. Sorry if my translations suck. ^(Blame Baidu)*`
      ), 5000);
    })    
  } else {
    // Translate partially Chinese comments
    const splitComment = comment.body.split('\n').join(' ').split(' ');
    let chineseChunks = [];
    let responseString = ''
    let completedRequests = 0;
    for (i = 0; i < splitComment.length; i++) {
      if (franc(splitComment[i], {minLength:1}) == 'cmn' && comment.author.name !== 'chinese_to_english') {
        console.log(new Date().toLocaleString() + ' | Translating partial comment ... ')
        let originalComment = splitComment[i]
        chineseChunks.push(originalComment)
      }
    }
    for (i = 0; i < chineseChunks.length; i++) {
      translate(chineseChunks[i]).then(response => {
      responseString = responseString + 
`

**Translation:** ${response.trans_result.dst} 

**Original Text:** ${response.trans_result.src}

---
`
      completedRequests++
      }).then(() => {
        if (completedRequests == chineseChunks.length) {
          responseString = responseString + `*I'm automated. View my profile for more info. Sorry if my translations suck. ^(Blame Baidu)*`
          comment.reply(responseString)
        }
      })
    }
  }
});