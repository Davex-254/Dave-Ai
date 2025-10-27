const axios = require("axios");

let daveplug = async (m, { dave, q, reply }) => {
    if (!q) return m.reply("Example: .movie inception");

    try {
        let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${q}&plot=full`);
        let imdbt = "";

        imdbt += "◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈\n";
        imdbt += "│ MOVIE SEARCH\n";
        imdbt += "◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈\n";
        imdbt += "│ Title       : " + fids.data.Title + "\n";
        imdbt += "│ Year        : " + fids.data.Year + "\n";
        imdbt += "│ Rated       : " + fids.data.Rated + "\n";
        imdbt += "│ Released    : " + fids.data.Released + "\n";
        imdbt += "│ Runtime     : " + fids.data.Runtime + "\n";
        imdbt += "│ Genre       : " + fids.data.Genre + "\n";
        imdbt += "│ Director    : " + fids.data.Director + "\n";
        imdbt += "│ Writer      : " + fids.data.Writer + "\n";
        imdbt += "│ Actors      : " + fids.data.Actors + "\n";
        imdbt += "│ Plot        : " + fids.data.Plot + "\n";
        imdbt += "│ Language    : " + fids.data.Language + "\n";
        imdbt += "│ Country     : " + fids.data.Country + "\n";
        imdbt += "│ Awards      : " + fids.data.Awards + "\n";
        imdbt += "│ BoxOffice   : " + fids.data.BoxOffice + "\n";
        imdbt += "│ Production  : " + fids.data.Production + "\n";
        imdbt += "│ imdbRating  : " + fids.data.imdbRating + "\n";
        imdbt += "│ imdbVotes   : " + fids.data.imdbVotes + "\n";
        imdbt += "◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈";

        await dave.sendMessage(
            m.chat,
            {
                image: {
                    url: fids.data.Poster,
                },
                caption: imdbt,
            },
            { quoted: m }
        );
    } catch (e) {
        m.reply("I cannot find that movie\n\n" + e);
    }
};

daveplug.help = ['movie'];
daveplug.tags = ['search'];
daveplug.command = ['movie'];

module.exports = daveplug;