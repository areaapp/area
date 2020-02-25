export default {
    async dropbox_add_folder(area, ctx) {
        const url = 'https://api.dropboxapi.com/2/files/create_folder_v2';

        await ctx._axios.post(url, {
            path: '/' + area.reaction.args.path,
            autorename: true
        }, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`,
                'Content-Type': 'application/json',
            }
        });
        ctx.db.updateLastExecution(area.id);
    }
};
