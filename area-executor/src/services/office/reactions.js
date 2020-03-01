export default {
    async office_outlook_send_email(area, ctx) {
        let message = {
            'subject': area.reaction.args.subject,
            'importance': 'Low',
            'body': {
                'contentType': 'HTML',
                'content': area.reaction.args.content
            },
            'toRecipients': [
                {
                    'emailAddress': {
                        'address': area.reaction.args.to
                    }
                }
            ]
        };

        const url = 'https://graph.microsoft.com/v1.0/me/messages';
        const { data } = await ctx._axios.post(url, message, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`,
                'Content-type': 'application/json'
            }
        });


        const sendUrl = 'https://graph.microsoft.com/v1.0/me/messages/' + data.id + '/send';
        await ctx._axios.post(sendUrl, null, {
            headers: {
                Authorization: `Bearer ${area.reaction.service.oauth_token}`,
            }
        });
        ctx.db.updateLastExecution(area.id);
        ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`);
    }
};
