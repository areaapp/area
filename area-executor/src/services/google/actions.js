export default {
    async google_gmail_new_email(area, reaction, ctx) {
        const email = area.user.email;
        const route = `https://www.googleapis.com/gmail/v1/users/${email}/messages?q=is:unread`;
        const { data } = await ctx._axios.get(route);

        if (!data.messages || !data.message.length) {
            return;
        }

        if (area.buffer) {
            const lastIdx = data.messages.findIndex(x => x.id === area.buffer);
            const msgs = lastIdx === -1 ? data.messages : data.messages.slice(0, lastIdx);

            for (const msg in msgs) {
                await reaction(area, ctx);
            }
        }
        ctx.db.updateBuffer(area.id, data.messages[0]);
    }
};
