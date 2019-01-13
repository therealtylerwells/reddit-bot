# reddit-bot
A Reddit bot to translate fully/partially Chinese comments to English (not running, banned in /r/china)
![Screenshot](https://res.cloudinary.com/asdfbot/image/upload/v1546666606/screenshot_meeqfc.png)

## How does it work?

We use `snoostorm` and `snoowrap` to read every comment posted in /r/china. We check every word in every comment using `franc` to determine if its language is Mandarin Chinese. If the lanaguage is Mandarin Chinese,
we use `baidu-translate-api` to *poorly* translate the Chinese to English. We also use `pinyin` to generate pinyin for each translation. Although the bot isn't running any longer, you can still
check its [user profile](https://www.reddit.com/user/chinese_to_english) to view some of its translations.
