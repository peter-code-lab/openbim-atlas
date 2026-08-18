# OpenBIM — repo conventions

## Git Identity

Author ALL commits in this repository as the repo owner, so they count toward
their GitHub contributions:

```
git config user.name "kylehonchan228-byte"
git config user.email "300718624+kylehonchan228-byte@users.noreply.github.com"
```

The SessionStart hook in `.claude/settings.json` sets this automatically at the
start of every Claude Code session; run it by hand if you are committing from a
machine that has not been configured. Never commit as a generic Claude/bot
identity — GitHub attributes a commit purely by its author email, and
`noreply@anthropic.com` credits nobody. Claude attribution belongs in the
`Co-Authored-By` trailer only.
