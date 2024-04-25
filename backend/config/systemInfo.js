
const os = require('os');

function getSystemInfo(req, res) {

    const totalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const ram = `${freeMemory}GB / ${totalMemory}GB`;


    const cpus = os.cpus();
    const processor = cpus[ 0 ].model;

    // Send the system information as JSON response
    res.json({ ram, processor });
}

module.exports = getSystemInfo;
