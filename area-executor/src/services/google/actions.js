export default {
    async google_gmail_new_email(area, reaction, ctx) {
        console.log('NEW MAIL');
        const email = area.user.email;
        const route = `https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread`;
        const { data } = await ctx._axios.get(route, {
            headers: {
                Authorization: `Bearer ${area.action.service.oauth_token}`
            }
        });


        if (!data.messages || !data.messages.length) {
            return;
        }

        if (area.action.buffer) {
            const lastIdx = data.messages.findIndex(x => x.id === area.action.buffer);
            const msgs = lastIdx === -1 ? data.messages : data.messages.slice(0, lastIdx);

            for (const msg in msgs) {
                await reaction(area, ctx);
            }
        }
        ctx.db.updateBuffer(area.action.id, data.messages[0].id);
    }
};
