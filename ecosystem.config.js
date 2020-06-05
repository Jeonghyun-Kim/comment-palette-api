module.exports = {
  apps: [{
  name: 'PALETTE',
  script: './build/server.js',
  instances: 0,
  exec_mode: ‘cluster’,
  wait_ready: true,
  listen_timeout: 50000
  }]
}