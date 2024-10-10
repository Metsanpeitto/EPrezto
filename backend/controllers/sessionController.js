const { initializeConversationState } = require('../middlewares/conversationStateManager')
 
const handleSession = (req, res) => {
  const { action } = req.body;
  const sessionId = req.session.id
  if (action === 'Connect') {
      initializeConversationState(req)
    
    return res.status(200).json({
      message: 'Session started successfully',
      sessionId: sessionId
    })
  }

  if (action === "Disconnect") {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to end session' });
      }
      return res.status(200).json({ message: 'Session ended successfully' });
    });
  }

  return res.status(400).json({ message: 'Invalid action' });
};

module.exports = {
  handleSession
};