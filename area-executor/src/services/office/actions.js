export default {
    async office_outlook_new_email(area, reaction, ctx) {
        const route = `https://graph.microsoft.com/beta/me/messages?$orderby=receivedDateTime%20desc&$top=1`;
        const { data } = await ctx._axios.get(route, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });


        if (data.value.length === 0) {
            return;
        }

        if (area.action.buffer) {
            const lastId = area.action.buffer;
            if (data.value[0].id !== lastId) {
                await reaction(area, ctx);
            }
        }
        ctx.db.updateBuffer(area.action.id, data.value[0].id);
    }
};
