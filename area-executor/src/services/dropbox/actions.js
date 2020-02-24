export default {
    async dropbox_new_content(area, reaction, ctx) {
        const url = 'https://api.dropboxapi.com/2/files/list_folder';
        const { data } = await ctx._axios.post(url, {
            path: '',
            recursive: true,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: true,
            include_non_downloadable_files: true
        }, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`,
                'Content-Type': 'application/json'
            }
        });

        const count = data.entries.length;
        if (area.action.buffer) {
            if (parseInt(area.action.buffer) < count) {
                await reaction(area, ctx);
            }
        }
        ctx.db.updateBuffer(area.action.id, count.toString());
    }
};
