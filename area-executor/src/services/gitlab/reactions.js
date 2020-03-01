export default {
    async gitlab_add_project(area, ctx) {
        const url = 'https://gitlab.com/api/v4/projects';
        await ctx._axios.post(url, {
            name: area.reaction.args.name,
            description: area.reaction.args.description,
            visibility: area.reaction.args.visibility,
        }, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
        ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`, true);
    }
};
