# PINA Toolkit

**Make sense of it. Make your next move.**

PINA is an interactive toolkit for thinking through briefs, understanding people, testing arguments, making decisions and communicating ideas. It brings practical frameworks into one place, with visual diagrams, guided questions and examples you can return to while working on a project.

Pip, PINA's folded-paper guide, helps you explore the toolkit. When connected to its AI backend, Ask Pip can explain concepts, suggest a starting point and help draft ideas for you to review.

[Open the hosted toolkit](https://pina-fieldguide.vivek-kr-jain.chatgpt.site/)

## How to use it

Choose a tool for the situation you are working through, then select:

1. **Learn it:** Explore the diagram and understand the idea one part at a time.
2. **Use it on my project:** Answer guided questions and watch your working map update.
3. **Netflix case study:** See the framework applied to an example. Adoption Check uses a studio example.

Review your draft, revisit your answers, and copy or download the result. My notebook brings your saved work together.

## Tools

| Category | Tools |
| --- | --- |
| Briefs and stakeholders | Brief X-Ray, Stakeholder Lens, Empathy Lens |
| Analysis and decisions | Reasoning Test, Recommendation Ladder, Logic Trap Deck, Negotiation Table, 3E Scale |
| Messages and persuasion | Reading Check, Trust Triangle, Lever Board |
| Pitches and value | Pitch Arc, Adoption Check |
| Review and handover | Story Check, Decision Record |

## Run locally

Use **Node.js 24 or newer**. Download or clone this repository, open a terminal in its root folder, and run:

```bash
npm run dev
```

Open **http://localhost:4173/**.

The development preview uses a temporary in-memory database. Live AI is disconnected by default.

Other commands:

```bash
npm test              # Run the automated checks
npm run build        # Build the backend and embedded website assets
npm run export:html  # Create a single-file HTML copy
```

The HTML export is written to `exports/PINA-toolkit.html`.

## Use the HTML copy

The downloadable `PINA-toolkit.html` includes the manual toolkit, diagrams, illustrations, quizzes and project forms in one file.

It can be opened locally without running the backend. Ask Pip's AI features require a hosted backend. Fonts load from Google Fonts when available and fall back to system fonts offline.

## GitHub Pages

The `docs/` folder contains the public static website. In repository **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/docs**, and save.

After editing the frontend in `dist/`, regenerate the published copy and commit the updated `docs/` folder:

```bash
npm run build:pages
```

The static deployment includes all manual tools. Live Ask Pip remains available through the hosted toolkit linked above until an AI backend is connected to this deployment.

## Connect Ask Pip

The AI connection belongs on the server. Supported providers are Google Gemini, OpenAI and Anthropic.

On a correctly configured hosted deployment, the signed-in owner can open **Ask Pip → Settings**, choose a provider, save an API key and test the connection. Visitors can use the enabled shared connection without entering their own keys; requests use that connection's quota.

Uploading the HTML to GitHub Pages provides the manual toolkit only. To enable AI on another host, deploy the backend as well and configure its database, encryption secret and trusted owner authentication. The backend currently expects platform-provided identity headers, so authentication must be adapted or supplied when moving to a different hosting platform.

**Never put API keys in the HTML or commit them to Git.**

## Project files

| Path | Purpose |
| --- | --- |
| `dist/` | Website pages, styles, scripts and illustrations |
| `worker/` | AI backend, build scripts, local preview and tests |
| `drizzle/` | Database migration |
| `scripts/export-html.mjs` | Single-file HTML exporter |
| `TESTING.md` | Validation notes |

## Your work and privacy

Project answers, notebook entries, chat history and attachments are stored in the browser where you use the toolkit. They do not automatically sync between devices or become public when the toolkit is published.

Use the project backup and import controls to move your work between browsers or keep a separate copy. Material submitted to Ask Pip is sent to the configured AI provider for processing.

The source download does not include saved projects, uploaded files, API keys or the live database.

## Credits

Created by **Aarshi Jain**, based on the PINA toolkit, stage templates, course readings and practical frameworks in critical thinking, persuasion, negotiation and storytelling. Framework and reading references are included within the toolkit.
