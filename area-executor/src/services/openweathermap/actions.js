const Config = require('../../../config/services.config.js');

export default {
    async openweathermap_is_raining(area, reaction, ctx) {
        const apiKey = Config.default.openweathermap.apiKey;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${area.action.args.city}&appid=${apiKey}`;

        const { data } = await ctx._axios.get(url);

        let isRaining = false;
        for (let obj of data.weather) {
            if (obj.id >= 500 && obj.id < 600) {
                isRaining = true;
                break;
            }
        }

        if (isRaining && area.action.buffer !== isRaining.toString()) {
            await reaction(area, ctx);
        }
        ctx.db.updateBuffer(area.action.id, isRaining.toString());
    },

    async openweathermap_wind_exceeds_speed(area, reaction, ctx) {
        const apiKey = Config.default.openweathermap.apiKey;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${area.action.args.city}&appid=${apiKey}`;

        const { data } = await ctx._axios.get(url);

        const speed = data.wind.speed;
        if (speed >= parseFloat(area.action.args.speed) && area.action.buffer != 'true') {
            ctx.db.updateBuffer(area.action.id, 'true');
            await reaction(area, ctx);
        } else {
            ctx.db.updateBuffer(area.action.id, 'false');
        }
    }
};
