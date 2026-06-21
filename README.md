# GreenVote - Permanente Stemopslag

Stemmen worden permanent opgeslagen in `votes.json` tot **31 december 2033**.

## Setup

1. **Dependencies installeren**:
   ```bash
   npm install
   ```

2. **Server starten**:
   ```bash
   npm start
   ```
   De server draait op `http://localhost:3000`

3. **Website openen**:
   Open `index.html` in je browser.

## Hoe het werkt

- **Stemmen worden opgeslagen**: Elke stem gaat naar `votes.json` op de server
- **Permanente opslag**: Stemmen blijven opgeslagen zelfs na browser verversen
- **Gedeeld zicht**: Iedereen die het platform bezoekt ziet dezelfde stemtotalen
- **Expiratie**: Stemmen blijven geldig tot 31 december 2033

## API Endpoints

- `GET /api/votes` - Huidige stemtotalen ophalen
- `POST /api/vote` - Een stem toevoegen (body: `{ "index": 0-5 }`)
- `GET /api/status` - Status en expiratie controleren
