exports.logAction = (action, message) => {
  console.log(`[${new Date().toISOString()}] ${action}: ${message}`);
};
