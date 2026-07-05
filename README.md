# August Chat Widget

Chat widget for August Motor Cars. The widget sits in the bottom-right corner of the dealership website. Customers can ask questions and get help from Jessica which is the agent.

## How to run it

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

I went with the Gemini API over OpenAI because it has a free tier that doesn't require a credit card. The chat uses a simple REST call rather than an SDK to keep dependencies minimal. 

I stored messages in localStorage so the conversation doesn't end when a user accidentally closed or refreshes. Every time a new message is sent or received, the convo gets saved to the browser's localStorage as JSON. When the widget loads, it checks if there's a saved conversation and picks up where you left off instead of showing the welcome screen again. Clicking "End Conversation" clears the stored messages so the next time the widget opens it starts fresh.
