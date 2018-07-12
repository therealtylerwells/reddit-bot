require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const franc = require('franc')
var translate = require('yandex-translate')(process.env.YANDEX_KEY);

const r = new Snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

const client = new Snoostorm(r);

const streamOpts = {
  subreddit: 'china+testingground4bots+shanghai',
  results: 25
};

const comments = client.CommentStream(streamOpts);

comments.on('comment', (comment) => {
  // Translate fully Chinese comments
  if (franc(comment.body, {minLength: 1}) == 'cmn' && comment.author.name !== 'chinese_to_english') {
    console.log('*** CHINESE DETECTED ... TRANSLATING! ***')
    translate.translate(comment.body, { to: 'en' }, function(err, res) {
      comment.reply(
// Left-aligned to avoid Reddit autoformatting as code block
`**Translation:** ${res.text}

**Original Text:** ${comment.body}



*I'm automated. If I'm misbehaving or if you want me to work in another sub, message /u\/paleforce*`
      );
    });
  } else {
    // Translate partially Chinese comments
    const splitComment = comment.body.split('\n').join(' ').split(' ');
    for (i = 0; i < splitComment.length; i++) {
      if (franc(splitComment[i], {minLength:1}) == 'cmn' && comment.author.name !== 'chinese_to_english') {
        console.log('*** CHINESE DETECTED ... TRANSLATING! ***')
        let originalComment = splitComment[i]
        translate.translate(splitComment[i], { to: 'en' }, function(err, res) {
          comment.reply(
// Left-aligned to avoid Reddit autoformatting as code block
`**Translation:** ${res.text}

**Original Text:** ${originalComment}



*I'm automated. If I'm misbehaving or if you want me to work in another sub, message /u\/paleforce*`
          );
        });
      }
    }
  }
});
