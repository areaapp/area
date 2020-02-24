async function getStreamerId(axios, oauthToken, streamer) {
    const usersUrl = 'https://api.twitch.tv/helix/users?login=' + streamer;
    const users = await axios.get(usersUrl, {
        headers: {
            Authorization: `Bearer ${oauthToken}`
        }
    });

    if (users.data.data.length === 0) {
        return null;
    }
    return users.data.data[0].id;
}

async function getGameId(axios, oauthToken, game) {
    const url = 'https://api.twitch.tv/helix/games?name=' + game;
    const games = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${oauthToken}`
        }
    });

    if (games.data.data.length === 0) {
        return null;
    }
    return games.data.data[0].id;
}

export default {
    async twitch_streamer_connected(area, reaction, ctx) {
        return;
        const url = 'https://api.twitch.tv/helix/streams?user_login=' + area.action.args.streamer;
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        if (data.data.length == 0) {
            // Not connected
            ctx.db.updateBuffer(area.action.id, 'false');
        } else {
            // Connected
            if (area.action.buffer === null || area.action.buffer === 'false') {
                ctx.db.updateBuffer(area.action.id, 'true');
                await reaction(area, ctx);
            } else {
                // Was already connected
                ctx.db.updateBuffer(area.action.id, 'false');
            }
        }
    },

    async twitch_new_follow(area, reaction, ctx) {
        return;
        const streamerId = await getStreamerId(ctx._axios, area.action.service.oauth_token, area.action.args.streamer);

        if (streamerId === null) {
            // Streamer not found
            return;
        }

        const url = 'https://api.twitch.tv/helix/users/follows?to_id=' + streamerId;
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        const nbFollower = parseInt(data.total);
        if (area.action.buffer !== null && parseInt(area.action.buffer) < nbFollower) {
            await reaction(area, ctx);
        }

        ctx.db.updateBuffer(area.action.id, data.total);
    },

    async twitch_new_video_of_streamer(area, reaction, ctx) {
        const streamerId = await getStreamerId(ctx._axios, area.action.service.oauth_token, area.action.args.streamer);

        if (streamerId === null) {
            // Streamer not found
            return;
        }

        const url = 'https://api.twitch.tv/helix/videos?first=1&user_id=' + streamerId;
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        if (data.data.length === 0) {
            // No videos
            return;
        }

        const lastId = area.action.buffer;
        if (lastId === null) {
            ctx.db.updateBuffer(area.action.id, data.data[0].id);
        } else if (data.data[0].id !== lastId) {
            ctx.db.updateBuffer(area.action.id, data.data[0].id);
            await reaction(area, ctx);
        }
    },

    async twitch_new_video_of_game(area, reaction, ctx) {
        const gameId = await getGameId(ctx._axios, area.action.service.oauth_token, area.action.args.game);

        if (gameId === null) {
            // Game not found
            return;
        }

        const url = 'https://api.twitch.tv/helix/videos?first=1&game_id=' + gameId;
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        if (data.data.length === 0) {
            // No videos
            return;
        }

        const lastId = area.action.buffer;
        if (lastId === null) {
            ctx.db.updateBuffer(area.action.id, data.data[0].id);
        } else if (data.data[0].id !== lastId) {
            ctx.db.updateBuffer(area.action.id, data.data[0].id);
            await reaction(area, ctx);
        }
    },

    async twitch_new_clip_of_game(area, reaction, ctx) {
        const gameId = await getGameId(ctx._axios, area.action.service.oauth_token, area.action.args.game);

        if (gameId === null) {
            // Game not found
            return;
        }

        const url = 'https://api.twitch.tv/helix/clips?first=1&game_id=' + gameId;
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        if (data.data.length === 0) {
            // No videos
            return;
        }

        const lastId = area.action.buffer;
        if (lastId === null) {
            ctx.db.updateBuffer(area.action.id, data.data[0].id);
        } else if (data.data[0].id !== lastId) {
            ctx.db.updateBuffer(area.action.id, data.data[0].id);
            await reaction(area, ctx);
        }
    }
};
