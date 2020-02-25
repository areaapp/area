async function getDevice(area, ctx) {
    const getDeviceUrl = 'https://api.spotify.com/v1/me/player/devices';
    const devicesData = await ctx._axios.get(getDeviceUrl, {
        headers: {
            Authorization: `Bearer ${area.reaction.service.oauth_token}`
        }
    });

    let device = devicesData.data.devices.find(element => element.name == area.reaction.args.device)
    return device;
}

async function getCurrentTrack(area, ctx) {
    const getCurrentTrackUrl = 'https://api.spotify.com/v1/me/player/currently-playing';
    const trackData = await ctx._axios.get(getCurrentTrackUrl, {
        headers: {
            Authorization: `Bearer ${area.reaction.service.oauth_token}`
        }
    });

    return trackData;

}

export default {
    async spotify_pause_music(area, ctx) {
        const device = await getDevice(area, ctx);

        if (device == undefined || !device.is_active) {
            console.log("Device unknown or inactive");
            return;
        }

        const pauseMusicUrl = 'https://api.spotify.com/v1/me/player/pause?device_id=' + device.id;

        await ctx._axios.put(pauseMusicUrl, null, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
    },

    async spotify_resume_music(area, ctx) {
        const device = await getDevice(area, ctx);

        if (device == undefined) {
            console.log("Device unknown or inactive");
            return;
        }

        const resumeMusicUrl = 'https://api.spotify.com/v1/me/player/play?device_id=' + device.id;
        const track = await getCurrentTrack(area, ctx);

        if (track == undefined) {
            console.log("No track to resume");
            return;
        }

        const uris = ["spotify:track:" + track.data.item.id];
        const data = {uris};

        await ctx._axios.put(resumeMusicUrl, data, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        })
        ctx.db.updateLastExecution(area.id);
    },

    async spotify_next_music(area, ctx) {
        const device = await getDevice(area, ctx);

        if (device == undefined || !device.is_active) {
            console.log("Device unknown or inactive");
            return;
        }

        const nextTrackUrl = 'https://api.spotify.com/v1/me/player/next?device_id=' + device.id;

        await ctx._axios.post(nextTrackUrl, null, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
    },

    async spotify_previous_music(area, ctx) {
        const device = await getDevice(area, ctx);

        if (device == undefined || !device.is_active) {
            console.log("Device unknown or inactive");
            return;
        }

        const previousTrackUrl = 'https://api.spotify.com/v1/me/player/previous?device_id=' + device.id;

        await ctx._axios.post(previousTrackUrl, null, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
    },

    async spotify_set_volume(area, ctx) {
        const device = await getDevice(area, ctx);

        if (device == undefined || !device.is_active) {
            console.log("Device unknown or inactive");
            return;
        }

        if (area.reaction.args.volume_percent < 0 || area.reaction.args.volume_percent > 100) {
            console.log("Volume percentage must be between 0 and 100");
            return;
        }

        const paramsUrl = 'volume_percent=' + area.reaction.args.volume_percent + '&device_id=' + device.id;
        const setVolumeUrl = 'https://api.spotify.com/v1/me/player/volume?'
        const url = setVolumeUrl + paramsUrl;

        await ctx._axios.put(url, null, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
    }
};
