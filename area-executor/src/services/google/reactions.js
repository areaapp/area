export default {
    async google_gmail_send_email(area, ctx) {
        const emailFormat = `From: ${area.user.email}\r\n\
        To: ${area.reaction.params.to} \r\n\
        Subject: ${area.reaction.params.subject} \r\n\
        Content-Type: text/html; charset='UTF-8'\r\n\
        Content-Transfer-Encoding: base64\r\n\r\n\
        <html><body>\
        ${area.reaction.params.content}\
        </body></html>`;
        const route = `https://www.googleapis.com/gmail/v1/users/${area.user.email}/messages/send`;
        const email = Buffer.from(emailFormat).toString('base64');


        await ctx._axios.post(route, {
            raw: area.user.email
        });
    }
};
