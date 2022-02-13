# WordPress.org Predefined replies

[📓 Install "Predefined Replies" UserScript](https://github.com/wporg-support/predefined-replies/raw/main/src/wordpress-predefined-replies.user.js)

![Forum post reply box with pre-defined answer options added](https://user-images.githubusercontent.com/468735/153733598-48e97671-6707-4d8a-ab24-425673fb2890.png)

## About this project

This is a userscript, used with TamperMonkey, GreaseMonkey, or equivalent, to provide support volunteers with a quick and easy way to supply recurring answers to users.

### Predefined replies

Predefined replies can be separated into two categories, 'curated' and 'local'. The curated list of pre-defined replies lives here, in this GitHub repository, while the local list is what you, the user, create for your own personal use.

#### Contributing to the curated lists

The curated lists are separated by locales, this because different communities have different approaches, common questions, and replies. The language files can be found within the `src/replies` directory, and are all named as `[locale].json`, where the locale is the local subdomain used on WordPress.org

For example, for the Swedish site, the local pre-defined replies would be found under `src/replies/sv.json`.

See the README.ME file in the replies section for further instructions on file structures.

## Installation

To install, open `/src/wordpress-predefined-replies.user.js` and hit the Raw button. TamperMonkey or GreaseMonkey will take over from there.

## Contributing

Contributions are welcome, bugreports, suggestions and even pull requests! No limitations, shoot for the stars!

The project uses no fancy build procedures, it's all JavaScript and the source is in the `src/` directory
