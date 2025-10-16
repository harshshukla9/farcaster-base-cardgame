
## 📱 Screenshots

| Splash Screen | Main Screen |
|:--------------:|:------------:|
| <img width="300" alt="Splash Screen" src="https://github.com/user-attachments/assets/c87c1a07-9c4f-4ae0-95e9-94277d65930c" /> | <img width="300" alt="Main Screen" src="https://github.com/user-attachments/assets/cfec0cf8-404e-4aca-840b-17a3c6dc5738" /> |

---


### Install the dependencies

```
pnpm install
```

### Copy `.env.example` over to `.env.local`

```bash
cp .env.example .env.local
```

### Run the template

```bash
pnpm dev
```

### View the App in Warpcast Embed tool

Warpcast has a neat [Embed tool](https://warpcast.com/~/developers/mini-apps/embed) that you can use to inspect the Mini App before you publish it.

Unfortunately, the embed tool can only work with remote URL. Inputting a localhost URL does not work.

As a workaround, you may make the local app accessible remotely using a tool like `cloudflared` or `ngrok`. In this guide we will use `cloudflared`.

#### Install Cloudflared

```bash
brew install cloudflared
```

For more installation options see the [official docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).

#### Expose localhost

Run the following command in your terminal:

```bash
cloudflared tunnel --url http://localhost:3000
```

Be sure to specify the correct port for your local server.

#### Set `NEXT_PUBLIC_URL` environment variable in `.env.local` file

```bash
NEXT_PUBLIC_URL=<url-from-cloudflared-or-ngrok>
```

#### Use the provided url

`cloudflared` will generate a random subdomain and print it in the terminal for you to use. Any traffic to this URL will get sent to your local server.

Enter the provided URL in the [Warpcast Embed tool](https://warpcast.com/~/developers/mini-apps/embed).

![embed-tool](https://docs.base.org/img/guides/farcaster-miniapp/1.png)

Let's investigate the various components of the template.

## Customizing the Mini App Embed

Mini App Embed is how the Mini App shows up in the feed or in a chat conversation when the URL of the app is shared.



Upon opening the Mini App, the first thing the user will see is the Splash screen:




