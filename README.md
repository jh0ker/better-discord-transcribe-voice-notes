# Transcribe Voice Notes

This plugin allows you to transcribe voice notes in Discord with STT (speech-to-text). It uses the OpenAI API (or compatible APIs). You need to configure your own API key in the plugin settings.

**Note:** A preset for [Groq](https://console.groq.com/docs/rate-limits#rate-limits) is included, which offers a free tier with no credit card required (at the time of writing).

It's built on [@philhk](https://github.com/philhk)'s [BetterDiscord Plugin Template](https://github.com/philhk/betterdiscord-plugin-template) :heart:

![Preview of the plugin transcribing a message](/meta/preview_github.png)


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
