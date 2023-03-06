# AWS SSM Port Forwarding to Remote Host Action

This action starts a port forwarding session between a specified remote host via a bastion using the AWS SSM SDK.

It is the equivalent of running `aws ssm start-session --target [instanceId] --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters '{"host": [destinationHost], "portNumber": [remotePort], "localPortNumber": [localPort]}'`

This repo is based on <https://github.com/gian2dchris/aws-ssm-port-forwarding-session-action>

## Usage

See [action.yml](action.yml)

## Example

Start a port forwarding session to `remote.host` via bastion with an instance id `i-1234` which exposes remote port `8888`, on local port `9999`:

```yaml
steps:
---
- name: SSM Port Forward
  uses: MoovenHQ/aws-ssm-port-forwarding-remote-host-action@v1.0.0
  with:
    bastion: 'i-1234'
    remoteHost: 'remote.host'
    remotePort: 8888
    localPort: 9999
- name: Curl Test
  run: |
    curl -v http://127.0.0.1:8888
```
