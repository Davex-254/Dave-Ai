let daveplug = async (m, { dave, reply, text }) => {
    try {
        if (!text) {
            return reply('Usage: .calc <expression>\nExample: .calc 17+19');
        }

        let val = text
            .replace(/[^0-9\-\/+*×÷πEe()piPI.]/g, '')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π|pi/gi, 'Math.PI')
            .replace(/e/gi, 'Math.E')
            .replace(/\/+/g, '/')
            .replace(/\++/g, '+')
            .replace(/-+/g, '-');

        let format = val
            .replace(/Math\.PI/g, 'π')
            .replace(/Math\.E/g, 'e')
            .replace(/\//g, '÷')
            .replace(/\*/g, '×');

        let result = (new Function('return ' + val))();

        if (isNaN(result)) {
            return reply('Invalid calculation. Example: .calc 17+19');
        }

        reply(`*${format}* = _${result}_`);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return reply('Invalid syntax. Please check your expression.');
        } else if (error instanceof Error) {
            return reply(error.message);
        } else {
            return reply('Calculation failed. Please try again.');
        }
    }
};

daveplug.help = ['calc <expression>'];
daveplug.tags = ['tools'];
daveplug.command = ['calc', 'calculater', 'calculator'];

module.exports = daveplug;