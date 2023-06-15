const enderecos = {
    Google: 'https://www.google.com',
    Facebook: 'https://www.facebook.com',
    Twitter: 'https://www.twitter.com',
    Instagram: 'https://www.instagram.com',
    StackOverflow: 'https://stackoverflow.com',
    GitHub: 'https://github.com',
    LinkedIn: 'https://www.linkedin.com',
};

const { exec } = require('child_process');

function verifyConnection(endereco) {
    return new Promise((resolve, reject) => {
        exec(`ping ${endereco}`, (error, stdout, stderr) => {
            const output = stdout.toString();
            if (output.includes('Host')) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

async function getNetworksConnection(win) {
    let dashboard = []

    const promessas = Object.entries(enderecos).map(([nome, endereco]) => verifyConnection(endereco));
    const resultados = await Promise.all(promessas);

    Object.entries(enderecos).forEach(([nome, endereco], index) => {
        const status = resultados[index] ? 'Online' : 'Offline';

        const rede = {
            [nome]: status
        }
        dashboard.push(rede)
    });


    return dashboard
}

module.exports = {
    getNetworksConnection
};


