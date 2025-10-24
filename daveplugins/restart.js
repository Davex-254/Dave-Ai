const { exec } = require('child_process');
const chalk = require('chalk');

let daveplug = async (m, { dave, daveshown, reply }) => {
    try {
        if (!daveshown) return reply("Owner only command!");

        // Add processing reaction
        await dave.sendMessage(m.chat, {
            react: { text: '...', key: m.key }
        });

        await reply("Restarting DaveAI bot...");

        // Detect hosting environment
        const isPterodactyl = process.env.P_SERVER_LOCATION || process.env.P_SERVER_UUID;
        const isRender = process.env.RENDER;
        const isHeroku = process.env.HEROKU;
        const isRailway = process.env.RAILWAY_ENVIRONMENT;

        if (isPterodactyl || isRender || isHeroku || isRailway) {
            console.log(chalk.cyanBright("Detected cloud environment. Exiting for auto-restart..."));
            
            // Add success reaction
            await dave.sendMessage(m.chat, {
                react: { text: '✓', key: m.key }
            });
            
            process.exit(0); // Cloud environment will auto-restart
        } else {
            // Fallback to PM2 restart
            exec("pm2 restart all", (err, stdout) => {
                if (err) {
                    console.error(chalk.red(`PM2 restart failed: ${err.message}`));
                    reply("Failed to restart using PM2. Try manual restart.");
                } else {
                    console.log(chalk.green(`PM2 restart successful:\n${stdout}`));
                    
                    // Add success reaction
                    dave.sendMessage(m.chat, {
                        react: { text: '✓', key: m.key }
                    }).catch(() => {}); // Ignore errors during restart
                }
            });
        }

    } catch (err) {
        console.error("Restart Command Error:", err);
        
        // Add error reaction
        await dave.sendMessage(m.chat, {
            react: { text: '✗', key: m.key }
        });
        
        await reply(`Error restarting bot:\n${err.message}`);
    }
};

daveplug.help = ['restart'];
daveplug.tags = ['system'];
daveplug.command = ['restart', 'reboot'];

module.exports = daveplug;