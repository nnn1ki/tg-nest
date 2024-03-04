module.exports = {
  apps : [
    {
      name: "nest",
      script: "/root/.nvm/versions/node/v21.4.0/bin/npm",
      args: "run start:prod",
      interpreter: "none",
      cwd: "/root/bot/tg-nest",
    },

  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
