import consola from 'consola';

export default {
    async github_new_repo_of_user(area, reaction, ctx) {
        const url = 'https://api.github.com/users/' + area.action.args.user + '/repos?sort=created';
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        if (data.length === 0) {
            // No repos
            return;
        }

        console.log("before: " + area.action.buffer);
        console.log("now: " + data[0].id);
        if (area.action.buffer) {
            const lastId = area.action.buffer;
            if (data[0].id != lastId) {
                await reaction(area, ctx);
            }
        }
        ctx.db.updateBuffer(area.action.id, data[0].id);
    }
};
