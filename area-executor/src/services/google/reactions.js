import { Base64 } from 'js-base64';

export default {
    async google_gmail_send_email(area, ctx) {
        console.log('SEND MAIL');
        const emailFormat = `\
Content-Type: text/html; charset="us-ascii"\n\
MIME-Version: 1.0\n\
Content-Transfer-Encoding: 7bit\n\
to: ${area.reaction.args.to}\n\
from: ${area.user.email}\n\
subject: ${area.reaction.args.subject}\n\n\
<html><body>\
${area.reaction.args.content}\
</body></html>`;

        console.log(emailFormat);
        const route = `https://www.googleapis.com/gmail/v1/users/${area.user.email}/messages/send`;

        const email = Base64.encodeURI(emailFormat);

        console.log(email);

        await ctx._axios.post(route, {
            raw: email
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${area.reaction.service.oauth_token}`
            }
        });
    }
};
