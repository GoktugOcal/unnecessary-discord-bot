const bard = require('./helpers/bard.js')


const fetch = require("node-fetch");

async function chat () {
  const BARD_URL =
    "https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";
  const Secure1PSID = process.env.Secure1PSID;
  const AT_KEY = process.env.AT_KEY;
  const PROMPT = "What is League of Legends?";

  const params = new URLSearchParams({
    bl: "boq_assistant-bard-web-server_20230419.00_p1",
    _reqid: Number(Math.random().toString().slice(2, 8)),
    rt: "c",
  });

  const messageRequest = [[PROMPT], null, ["", "", ""]];

  const headers = new Headers();
  headers.append("X-Same-Domain", "1");
  headers.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
  );
  headers.append(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8"
  );
  headers.append("Sec-Fetch-Site", "same-origin");
  headers.append("Sec-Fetch-Mode", "cors");
  headers.append("Sec-Fetch-Dest", "empty");
  headers.append("Cookie", `__Secure-1PSID=${Secure1PSID};`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("at", AT_KEY);
  urlencoded.append(
    "f.req",
    JSON.stringify([null, JSON.stringify(messageRequest)])
  );

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: urlencoded,
    redirect: "follow",
  };

  const request = await fetch(`${BARD_URL}?${params}`, requestOptions);
  const response = await request.text();

  const output = JSON.parse(response.split(/\r?\n/)[3])[0][2];
  const content = JSON.parse(output)[0][0];

  console.log(content);
}

// chat()

res = bard.ask("How is the weather in Istanbul?" + " Make it short in 3 sentences.")
console.log(res)

// import BingChat from 'bing-chat';

// async function example() {
//   const api = new BingChat({
//     cookie: "QS=0&TQS=0&cdxndoff=1"
//   })

//   const res = await api.sendMessage('Hello World!')
//   console.log(res.text)
// }

// console.log(example)