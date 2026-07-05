# August Chat Widget
See demo below:

https://github.com/user-attachments/assets/2d24d059-acd3-44b8-8623-9b94ed1ea251

Chat widget for August Motor Cars. The widget sits in the bottom right of the screen for the dealership website. Customers can ask questions and get help from Jessica which is the agent.

## How to run

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file in the root with your Gemini API key:
  ```
   VITE_GENAI_API_KEY=your_key_here
  ```
   You can get a free key from [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   
4. Run `npm run dev`
5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment variables

| Variable           | Required | Description                             |
| ------------------ | -------- | --------------------------------------- |
| VITE_GENAI_API_KEY | Yes      | Google Gemini API key (free tier works) |

## Tech stack
- React 19
- Vite
- Google Gemini API (gemini-2.5-flash)
- Custom CSS (no component libraries)
- localStorage for chat persistence

## Thoughts/Notes
The doc sent had some inconsistencies and I used best judgetment for fixes. See below:

- augustmotorcars.com/customs doesn't exist, found fixed link [https://www.augustmotorcars.com/august-customs/](https://www.augustmotorcars.com/august-customs/)
- [vaultdrive.com](http://vaultdrive.com) reference in doc invalid link
- no VAPI api key (no worries), I added logic for the call/voice screen but it's just React components, no functionality

I went with the Gemini API over OpenAI because it has a free tier that doesn't require a credit card. The chat uses a simple REST call rather than an SDK to keep dependencies minimal. 

I stored messages in localStorage so the conversation doesn't end when a user accidentally closed or refreshes. Every time a new message is sent or received, the convo gets saved to the browser's localStorage as JSON. When the widget loads, it checks if there's a saved conversation and picks up where you left off instead of showing the welcome screen again. Clicking "End Conversation" clears the stored messages so the next time the widget opens it starts fresh.

API error messages added. I think gemini is like 15 messages until rate limited so right now just shows message straight from gemini. Can be customized.

Code structure is modular. It is a standalone component that can be ported to any React app. See below.

Some nice sounds play on pickup/ start call and also when msgs are sent. Can be muted/toggled.

## Using the widget in another React app (SEE LICENSE FILE)
This code and software is completely free for you to use under the MIT License. You can modify and deploy however you would like!

I designed the whole chat system in one modular folder `src/components/chat-widget/`. It has no external dependencies outside of React itself so all the logic, styles, assets, and API code are inside that one folder. You are free to use it wherever, I give you full rights.

To drop it into another React project:

1. Copy the `chat-widget/` folder into your project's components directory (e.g. `src/components/chat-widget/`)
2. Add a `VITE_GENAI_API_KEY` to your `.env`
3. Import and render it:

```jsx
import ChatWidget from './components/chat-widget/ChatWidget'

function App() {
  return (
    <div>
      {/* your app content */}
      <ChatWidget />
    </div>
  )
}
```

Widget should work after this. Note that right now the API key live in the frontend, which is fine for a demo but not for production. If someone wanted to, they could find the key from the network tab on browser and spam it like crazy.

Before deploying for real (if you ever did), I'd heavily suggest moving the API call behind a proxy or something (like express or cloudflare) that holds the key. Then call the server instead of gemini directly.

If you want to customize the system prompt (context for the model before the message chain starts), you can modify  `src/components/constants/prompts.js`
