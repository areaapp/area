export default {
    async github_create_issue(area, ctx) {
        const url = `https://api.github.com/repos/${area.reaction.args.owner}/${area.reaction.args.repo}/issues`;
        const issue = {
            title: area.reaction.args.title,
            body: area.reaction.args.body
        }

        console.log(url);
        console.log(issue);
        await ctx._axios.post(url, issue, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${area.reaction.service.oauth_token}`
            }
        });
    }
};
