const address = {
  Google: "www.google.com",
  Facebook: "www.facebook.com",
  Twitter: "www.twitter.com",
  Instagram: "www.instagram.com",
  GitHub: "www.github.com",
  StackOverflow: "www.stackoverflow.com",
  OpenAI: "www.openai.com",
  YouTube: "www.youtube.com",
  LinkedIn: "www.linkedin.com",
  Reddit: "www.reddit.com",
};

const { exec } = require("child_process");

function verifyConnection(adress) {
  return new Promise((resolve, reject) => {
    exec(`ping ${adress}`, (error, stdout, stderr) => {
      const output = stdout.toString();
      if (output.includes("Host")) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function getNetworksConnection(win) {
  let dashboard = [];

  const promises = Object.entries(address).map(([name, adress]) =>
    verifyConnection(adress)
  );
  const results = await Promise.all(promises);

  Object.entries(address).forEach(([name, adress], index) => {
    const status = results[index] ? "Online" : "Offline";

    const network = {
      [name]: status,
    };
    dashboard.push(network);
  });

  return dashboard;
}

module.exports = {
  getNetworksConnection,
};
