module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
	apps : [
		{
			script    : "bin/www",
			env: {
				name      : "jsPratiche-TEST",
				"NODE_ENV": "development",
				"PORT": 4000
			},
			env_production : {
				name      : "jsPratiche",
				"NODE_ENV": "production",
				"PORT": 3000
			}
		},	
	],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/production",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production",
      env  : {
          PORT: 3000
      }
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env  : {
        PORT: 4000,
        NODE_ENV: "dev"
      }
    }
  }
}
