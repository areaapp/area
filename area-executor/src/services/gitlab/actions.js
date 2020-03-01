export default {
    async gitlab_new_project(area, reaction, ctx) {
        const url = `https://gitlab.com/api/v4/users/${area.action.args.user}/projects`;
        const { data } = await ctx._axios.get(url, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });

        const count = data.length;
        if (area.action.buffer) {
            if (parseInt(area.action.buffer) < count) {
                await reaction(area, ctx);
            }
        }
        ctx.db.updateBuffer(area.action.id, count.toString());
    }
};
