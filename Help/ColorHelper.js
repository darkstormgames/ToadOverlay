const seedrandom = require('seedrandom');

module.exports = {
    getRandomColor: (internalId, guild, channel) => {
        let rng_r = seedrandom(((internalId * 97) * (guild.id % 42) + (channel.id % 420)).toString());
        let rng_b = seedrandom(((guild.id % 97) * (channel.id % 42) + (internalId * 420)).toString());
        let rng_g = seedrandom(((channel.id % 97) * (internalId * 42) + (guild.id % 420)).toString());
    
        let r = (((rng_r() * 100000000) % 10000) % 256),
            g = (((rng_b() * 100000000) % 10000) % 256),
            b = (((rng_g() * 100000000) % 10000) % 256);
        return ((b & 0xFF) + ((g << 8) & 0xFF00) + ((r << 16) & 0xFF0000));
    }
}
