const axios = require('axios');

const BASE_URL = 'https://bard.google.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';

class Chatbot {
    /**
     * A class to interact with Google Bard.
     * @param {string} sessionId - The __Secure-1PSID cookie.
     */
    constructor(sessionId) {
        this.headers = {
            'Host': 'bard.google.com',
            'X-Same-Domain': '1',
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Origin': BASE_URL,
            'Referer': BASE_URL + '/',
        };
        this._reqid = 1;
        this.conversationId = '';
        this.responseId = '';
        this.choiceId = '';
        this.session = axios.create({
            headers: this.headers,
            withCredentials: true,
        });
        this.session.defaults.headers.common['Cookie'] = '__Secure-1PSID=' + sessionId;
        this.SNlM0e = this.__getSnlm0e();
        // this.SNlM0e = process.env.Secure1PSID;

    }

    async __getSnlm0e() {
        const resp = await this.session.get(BASE_URL, { timeout: 10000 });
        // Find "SNlM0e":"<ID>"
        if (resp.status !== 200) {
            throw new Error('Could not get Google Bard');
        }
        console.log(resp.data.match("SNlM0e"));
        const SNlM0e = resp.data.match(/"SNlM0e":"(.*?)"/)[1];

        return SNlM0e;
    }

    async ask(message) {
        /**
         * Send a message to Google Bard and return the response.
         * @param {string} message - The message to send to Google Bard.
         * @returns {Object} A dict containing the response from Google Bard.
         */
        // url params
        const params = {
            'bl': 'boq_assistant-bard-web-server_20230315.04_p2',
            '_reqid': String(this._reqid),
            'rt': 'c',
        };

        // message arr -> data["f.req"]. Message is double json stringified
        const messageStruct = [
            [message],
            null,
            [this.conversationId, this.responseId, this.choiceId],
        ];
        const SNlM0e = await this.__getSnlm0e();
        const data = {
            'f.req': JSON.stringify([null, JSON.stringify(messageStruct)]),
            'at': SNlM0e,
        };


        // do the request!
        const resp = await this.session.post(
            BASE_URL + '/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate',
            new URLSearchParams(data).toString(),
            { params, timeout: 120000 },
        );

        const chatData = JSON.parse(resp.data.split('\n')[3])[0][2];
        if (!chatData) {
            return { content: `Google Bard encountered an error: ${resp.data}.` };
        }
        const jsonChatData = JSON.parse(chatData);
        // check if properties exist
        if (!jsonChatData[0] || !jsonChatData[1] || !jsonChatData[2] || !jsonChatData[3] || !jsonChatData[4]) {
            if (jsonChatData[0] && jsonChatData[0][0]) {
                return { content: jsonChatData[0][0] };
            } else {
                return { content: `Google Bard encountered an error: ${resp.data}.` };
            }
        }
        const results = {
            content: jsonChatData[0][0],
            conversationId: jsonChatData[1][0],
            responseId: jsonChatData[1][1],
            factualityQueries: jsonChatData[3],
            textQuery: jsonChatData[2][0] || '',
            choices: jsonChatData[4].map(i => ({ id: i[0], content: i[1] })),
        };
        this.conversationId = results.conversationId;
        this.responseId = results.responseId;
        // choiseId might be undefined

        this.choiceId = results.choices[0]?.id || "Google Bard couldn't answer this question.";
        this._reqid += 100000;
        return results;
    }
  }

module.exports = Chatbot;