# Creating pre-defined replies

The pre-defined replies are all separated out into language-aware files. the `en.json` file is the default, used on the global forums on WordPress.org, and is also the fallback if no locale-specific file exists.

## File format

The file is a standard JSON formated file, with key-identifiers for each entry for more control.

## Example format

```JSON
{
	"wporg-1": {
		"label": "This is the title of your reply",
		"content": "This is the content of your reply"
	},
	"wporg-2": {
		"label": "This is the title of your 2nd reply",
		"content": "This is the content of your 2nd reply"
	},
}
```

Notice that the `label` and `content` entries are keys, and should not be changed, as they are required for the pre-defined replies controller to recognize the content correctly.

The `wporg-1` and `wporg-2` texts are incremental keys, indicating each individual new entry, just keep adding to the last number and you'll be fine.

## Escaping output

Since this is JSON, you can put must types of content in, but be mindful of:

- `\n` is used to add a line break to your content
- Escape any `"` symbols inside your text by adding a `\` infront of it, for example `<a href=\"https://wordpress.org\">Link to WordPress</a>`
