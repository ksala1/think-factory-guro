mv .git ../.git_backup
npx wrangler deploy
mv ../.git_backup .git
