const enderecos = {
  intranet: "10.1.113.250",
  Sisbol: "10.1.113.226",
  SPED: "10.1.113.247",
  ZABBIX_ATUAL: "10.1.113.210",
  PORTAL_DE_SISTEMA: "10.1.113.223",
  DNS: "10.1.113.204",
  CTIS: "10.1.113.234",
  SISTEMA_PESSOAL: "10.1.113.235",
  SISTEMA_ACADEMICO: "10.1.113.241",
  wise_fi: "172.16.29.30",
  SIST_ARRANCHAMENTO: "10.1.113.220",
  PORTAL_HOMOLOG: "10.1.113.222",
  LDAP: "10.1.113.248",
  FAP: "10.1.113.211",
  DNS1_2CTA: "10.3.4.131",
  DN2_2CTA: "10.3.5.131",
  INTRANET_2CTA: "intranet.2cta.eb.mil.br",
  INEXISTENTE: "10.1.113.206",
};

const { exec } = require("child_process");

function verifyConnection(endereco) {
  return new Promise((resolve, reject) => {
    exec(`ping ${endereco}`, (error, stdout, stderr) => {
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

  const promessas = Object.entries(enderecos).map(([nome, endereco]) =>
    verifyConnection(endereco)
  );
  const resultados = await Promise.all(promessas);

  Object.entries(enderecos).forEach(([nome, endereco], index) => {
    const status = resultados[index] ? "Online" : "Offline";

    const rede = {
      [nome]: status,
    };
    dashboard.push(rede);
  });

  return dashboard;
}

module.exports = {
  getNetworksConnection,
};
