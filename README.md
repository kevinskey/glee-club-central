# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2cf8ddd9-7edc-45f1-a4ba-011c3aa74730

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2cf8ddd9-7edc-45f1-a4ba-011c3aa74730) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Run the setup script to install dependencies and create a `.env` file.
./setup.sh

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Sister Sites

This project links out to several subdomains that offer specialized features:

- [reader.gleeworld.org](https://reader.gleeworld.org) – digital sheet music library
- [studio.gleeworld.org](https://studio.gleeworld.org) – rehearsal and recording hub
- [merch.gleeworld.org](https://merch.gleeworld.org) – dedicated merchandise store

Navigation to these sister sites appears in the header and mobile menu.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2cf8ddd9-7edc-45f1-a4ba-011c3aa74730) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Environment Variables

Certain features require Supabase credentials. Define these variables in a `.env` file or your deployment environment:

```bash
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SOUNDCLOUD_CLIENT_ID=<your-soundcloud-client-id>
SOUNDCLOUD_CLIENT_SECRET=<your-soundcloud-client-secret>
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` are required. If you want to enable the optional SoundCloud integration you must also provide `SOUNDCLOUD_CLIENT_ID` and `SOUNDCLOUD_CLIENT_SECRET`. Without these, SoundCloud authentication will fail.

## Recording Library and Karaoke Studio

This project uses open source audio libraries including **Tone.js**, **WaveSurfer.js**, and **soundfont-player** to power the metronome, pitch pipe, and karaoke studio. Saved recordings are uploaded to the Supabase `audio` bucket so your mixes remain accessible from any device.

See [docs/RECORDING_PROCESS.md](docs/RECORDING_PROCESS.md) for a step-by-step guide on creating and managing recordings.

## SoundCloud Integration Tools

The admin panel now includes a dedicated **SoundCloud** section under content management. After connecting your SoundCloud account via OAuth, you can:

- Browse your personal library directly in the dashboard.
- Import public tracks or playlists by URL.
- Manage homepage embeds with the **SoundCloud Embed Manager**.
- Tweak playback options in **Player Settings**.

These tools rely on the SoundCloud API so be sure to configure `SOUNDCLOUD_CLIENT_ID` and `SOUNDCLOUD_CLIENT_SECRET` in your `.env` file.

## Updating Store Product Images

If your store items are missing proper product photos, you can generate new mockups with the helper script:

```bash
node scripts/updateStoreImages.js
```

The script connects to your Supabase project using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your `.env` file. It looks for T‑shirt, hoodie, and sweatshirt products, generates new images with the `generate-product-mockup` function, and updates each product's `image_url` field.
