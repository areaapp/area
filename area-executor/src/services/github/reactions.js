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
        ctx.db.updateLastExecution(area.id);
        ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`, true);
    },

    async github_add_reaction_issue_comment(area, ctx) {
        const args = area.reaction.args;
        const url = `https://api.github.com/repos/${args.owner}/${args.repo}/issues/comments/${args.commentId}/reactions`;

        await ctx._axios.post(url, {
            content: args.reaction
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.squirrel-girl-preview+json',
                Authorization: `token ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
        ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`, true);
    },

    async github_add_reaction_issue(area, ctx) {
        const args = area.reaction.args;
        const url = `https://api.github.com/repos/${args.owner}/${args.repo}/issues/${args.issueNumber}/reactions`;

        await ctx._axios.post(url, {
            content: args.reaction
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.squirrel-girl-preview+json',
                Authorization: `token ${area.reaction.service.oauth_token}`
            }
        });
        ctx.db.updateLastExecution(area.id);
        ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`, true);
    }
};
