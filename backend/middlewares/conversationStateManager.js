const { ConversationStages } = require('../constants/conversationStages')

const initializeConversationState = (req) => {
  if (!req.session?.conversationState) {
    req.session.conversationState = {
      stage: ConversationStages.INTRODUCTION,
      policyStatus: null,
      policyLink: null,
      policyMessage: null,
    };
  }
};

module.exports = { initializeConversationState }