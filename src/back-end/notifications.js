const path = require("path")
const iconDir = '../../dist/assets/globo-terrestre.ico'

const appRunInSecondPlan = () => {
  return {
    title: `Network Connection Checker`,
    message: `Programa aberto em segundo plano.`,
    icon: path.join(__dirname, iconDir),
  };
};

const networkConnections = (messages) => {
  return {
    title: `${
      messages.length == 0
        ? "Nenhuma rede se encontra Offline"
        : "A redes que se encontra Offline."
    }`,
    message: `${messages.join("")}\n`,
    icon: path.join(__dirname, iconDir),
  };
};

module.exports = {
    appRunInSecondPlan,
    networkConnections
};
