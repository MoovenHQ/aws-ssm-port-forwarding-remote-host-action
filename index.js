const core = require('@actions/core');
const github = require('@actions/github');
const { SSMClient, StartSessionCommand } = require('@aws-sdk/client-ssm');

function SanitizeInputs() {
  const bastionId = core.getInput('bastionId', { required: true });
  const remoteHost = core.getInput('remoteHost', { required: true });
  const remotePort = core.getInput('remotePort', { required: true });
  const localPort = core.getInput('localPort', { required: true });
  const documentName = 'AWS-StartPortForwardingSessionToRemoteHost';

  return {
    Target: bastionId,
    DocumentName: documentName,
    Parameters: {
      host: [remoteHost],
      portNumber: [remotePort],
      localPortNumber: [localPort],
    },
    Reason: `${github.context.serverUrl}/${
      github.context.repo
    }/actions/runs/${github.context.runId.toString()}`,
  };
}

const run = async () => {
  try {
    console.log('Start SSM Port Forwarding Session to Remote Host');
    const client = new SSMClient({
      region: process.env.AWS_DEFAULT_REGION,
      customUserAgent: 'gha'.concat('-', github.context.repo.repo),
    });

    const params = SanitizeInputs();
    const command = new StartSessionCommand(params);

    const data = await client.send(command);
    core.saveState('sessionId', data.SessionId);
  } catch (err) {
    console.error(err, err.stack);
    core.setFailed(err.message);
  }
};

run();
