require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

const OpenAI = require('openai').OpenAI;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

client.on('messageCreate', async function(message) {
    try {
        // Avoid responding to other bots or itself
        if (message.author.bot) return;

        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "ChatGPT is fren." },
                { role: "assistant", content: "Hello, How are you?" },
                { role: "user", content: `${message.content}` } // No need for username in content
            ],
            temperature: 0.9,
            max_tokens: 100,
            stop: ["ChatGPT:"]
        });

        // Using the response to reply in Discord
        const assistantReply = gptResponse.choices[0].message.content;
        message.reply(assistantReply);

    } catch(err) {
        console.log("Error:", err.message);
    }
});

client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord");
