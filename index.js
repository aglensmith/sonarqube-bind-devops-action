const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

try {
    const sonarHostUrl = new URL(core.getInput('sonarHostUrl'));
    const host = sonarHostUrl.hostname;
    const port = sonarHostUrl.port;
    const sonarToken = core.getInput('sonarToken');
    const almSetting = core.getInput('almSetting');
    const project = encodeURIComponent(core.getInput('project'));
    const repository = encodeURIComponent(core.getInput('repository'));
    const summaryCommentEnabled = core.getInput('summaryCommentEnabled');
    const monorepo = core.getInput('monorepo');
    const form = `almSetting=${almSetting}&project=${project}&repository=${repository}&summaryCommentEnabled=${summaryCommentEnabled}&monorepo=${monorepo}`;

    console.log(`[sonarqube-bind-devops-action]: Inputs`);
    console.log(`\n======================================`);
    console.log(`host: ${host}`);
    console.log(`port: ${port}`);
    console.log(`project: ${project}`);
    console.log(`almSetting: ${almSetting}`);
    console.log(`project: ${project}`);
    console.log(`repository: ${repository}`);
    console.log(`summaryCommentEnabled: ${summaryCommentEnabled}`);
    console.log(`monorepo: ${monorepo}`);
    console.log(`form: ${form}`);
    console.log(`======================================\n`);

    let req = https.get({
      host: host,
      port: port,
      path: `/api/alm_settings/get_binding?project=${project}`,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(sonarToken + ':').toString('base64')
      }}, 
      function (res) {
      console.log(`[sonarqube-bind-devops-action]: GET /api/alm_settings/get_binding - ${res.statusCode}`);
      res.on('data', d => {
        if ('key' in JSON.parse(d)) {
          console.log('[sonarqube-bind-devops-action]: Project DevOps configuration found. Skipping create configuration.');
        } else {
          console.log("[sonarqube-bind-devops-action]: No project DevOps configuration found. Creating configuration.");
    
          let post_req = https.request({
            host: host,
            port: port,
            method: 'POST',
            path: '/api/alm_settings/set_github_binding',
            headers: {
              'Authorization': 'Basic ' + Buffer.from(sonarToken + ':').toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }, (res) => {
            console.log(`[sonarqube-bind-devops-action]: POST /api/alm_settings/set_github_binding - ${res.statusCode}`);
            res.on('data', (d) => {
              process.stdout.write(d);
            });
          });
    
          post_req.on('error', (e) => {
            console.error(e);
          });
    
          post_req.write(form);
          post_req.end();
        }
      })
    })
    
    req.on('error', error => {
      console.error(error);
    })
    
    req.end();

  } catch (error) {
    core.setFailed(error.message);
  }