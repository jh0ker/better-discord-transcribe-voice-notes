# Transcribe Voice Notes

This plugin allows you to transcribe voice notes in Discord with STT (speech-to-text). It uses the OpenAI Whisper model through their API.

It's built on [@philhk](https://github.com/philhk)'s [BetterDiscord Plugin Template](https://github.com/philhk/betterdiscord-plugin-template) :heart:

![241014_015030_Discord](https://github.com/user-attachments/assets/13553814-079a-4511-a94b-4ded03fa9c80)
![241014_015226_Discord](https://github.com/user-attachments/assets/840123c3-0164-4392-a556-fb7288bed7d6)


# BetterDiscord Plugin Template

This is a template used to create a BetterDiscord plugin using Vite and TypeScript.

## Plugin Config

In the `betterdiscord.config.ts` you can configurate following

- `name` The name of the addon. Typcially does not contain spaces, but is allowed.
- `author` The name of you the developer.
- `description` A basic description of the what the addon does.
- `version` Version representing the current update level. Semantic versioning recommended.

Optional

- `invite` A Discord invite code, useful for directing users to a support server.
- `authorId` Discord snowflake ID of the developer. This allows users to get in touch.
- `authorLink` Link to use for the author's name on the addon pages.
- `donate` Link to donate to the developer.
- `patreon` Link to the patreon of the developer.
- `website` Developer's (or addon's) website link.
- `source` Link to the source on GitHub of the addon.

## Vite Config

Change the value of `OUT_DIR` -> `` path.resolve(`${process.env.APPDATA}/BetterDiscord/plugins`) `` if you want to output directly to your plugins folder.

## Scripts

- `build` Build the plugin.
- `watch` Build the plugin when a change was made.

## Credits

- [Zerthox](https://github.com/Zerthox) for BetterDiscord's API typings.
