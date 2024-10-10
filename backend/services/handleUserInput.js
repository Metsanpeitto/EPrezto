const { plateRegex, emailRegex, nameRegex } = require("../constants/regex");
const { ConversationStages } = require("../constants/conversationStages");
const { initializeConversationState } = require('../middlewares/conversationStateManager')
const {
  fetchCustomerByPlate,
  fetchCustomerByEmail,
  fetchCustomerByName,
} = require("./agentHelper");
const { askAgent } = require("./askAgent");
const { queryLLMActionYesOrNo, queryLLMSuggestion } = require("./queries")
const { filterSuggestion } = require('../utils/filterSuggestion')

const PREGUNTA_OTRA_ACCION =
  "¿Deseas realizar otra acción? Puedo ayudarte a completar el pago o proporcionarte más información sobre la póliza.";

const updateConversationStage = (req, newStage) => {
  try {
    req.session.conversationState.stage = newStage;
  } catch (error) {
    console.log("conversationState.stage error:", error)
  }
};

const processPolicyData = (req, policyStatus, policyMessage, policyLink) => {
  req.session.conversationState.policyLink = policyLink;
  updateConversationStage(req, ConversationStages.ACTION_REQUEST);
  if (policyStatus && policyMessage) {
    return `${policyMessage}. Quisieras emitir la poliza?`;
  }
  if (!policyStatus && policyMessage) {
    return policyMessage;
  }
};

const processPolicyDataResponse = (req, typeOfInput) => {
  const { policyStatus, policyMessage, policyLink } = req.session.conversationState

  if (policyStatus || policyMessage) {
    const policyDataResponse = processPolicyData(req, policyStatus, policyMessage, policyLink);
    return this.handleUserInput(req, policyDataResponse)
  }
  if (!policyStatus && !policyMessage) {
    updateConversationStage(req, ConversationStages.DATA_REQUEST)

    switch (typeOfInput) {
      case "plate":
        return "No se encontró información para esa placa. Por favor intenta con un email o nombre.";

      case "email":
        return "No se encontró información para ese email. Por favor intenta con un número de placa o nombre.";

      case "name":
        return `No se encontró ninguna informacion con ese nombre.
                   Por favor intentalo con un email o numero de placa.`;
    }
    return "No se encontró información para esa placa. Por favor intenta con un email o nombre.";
  }
};

const populateSessionConversationStatePolicyData = (req, policyData) => {
  const { policyStatus, policyLink, policyMessage } = policyData
  req.session.conversationState = {
    ...req.session.conversationState,
    policyStatus,
    policyLink,
    policyMessage,
  };
}


exports.handleUserInput = async (req, userInput) => {
  initializeConversationState(req)
  const { stage } = req.session.conversationState

  switch (stage) {
    case ConversationStages.INTRODUCTION:
      const introductionResponse =
        "Buenos días, por favor bríndame el número de placa del auto, email o nombre del cliente.";
      updateConversationStage(req, ConversationStages.DATA_REQUEST);
      return introductionResponse;

    case ConversationStages.DATA_REQUEST:
      if (userInput.match(plateRegex)) {
        const plate = userInput.match(plateRegex);
        const policyData = await fetchCustomerByPlate(plate[0]);
        populateSessionConversationStatePolicyData(req, policyData)
        return processPolicyDataResponse(req, "plate");
      }
      if (userInput.match(emailRegex)) {
        const email = userInput.match(emailRegex);
        const policyData = await fetchCustomerByEmail(email[0]);
        populateSessionConversationStatePolicyData(req, policyData)
        return processPolicyDataResponse(req, "email");
      }
      if (userInput.match(nameRegex)) {
        const name = userInput.match(nameRegex);
        const policyData = await fetchCustomerByName(name[0]);
        populateSessionConversationStatePolicyData(req, policyData)
        return processPolicyDataResponse(req, "name");
      }
      updateConversationStage(req, ConversationStages.DATA_REQUEST);
      return `No se encontró ninguna informacion.
              Por favor proporciona un número de placa, email o nombre del cliente válidos.`;

    case ConversationStages.ACTION_REQUEST:
      try {
        updateConversationStage(req, ConversationStages.ACTION_CONFIRMATION);
        const responseSuggestedAction = await askAgent(userInput, queryLLMSuggestion);
        console.log(responseSuggestedAction)
        const filteredResponse = filterSuggestion(responseSuggestedAction)
        return filteredResponse
      } catch (error) {
        console.log(error)
        return error
      }

    case ConversationStages.ACTION_CONFIRMATION:
      try {
        const negativeOrPositiveAnswer = await askAgent(userInput, queryLLMActionYesOrNo);
        if (negativeOrPositiveAnswer === "Si" || userInput.toLowerCase() === "si") {
          const policyLink = req.session.conversationState.policyLink;
          updateConversationStage(req, ConversationStages.CONCLUSION);
          if (policyLink) {
            return `Este es el link a la póliza: ${policyLink}.${PREGUNTA_OTRA_ACCION}`;
          }
          return PREGUNTA_OTRA_ACCION;
        }

        if (negativeOrPositiveAnswer === "No" || userInput.toLowerCase() === "no") {
          updateConversationStage(req, ConversationStages.CONCLUSION);
          this.handleUserInput(req, '')
        }
      } catch (error) {
        console.log(error)
        return error
      }

    case ConversationStages.CONCLUSION:
      updateConversationStage(req, ConversationStages.INTRODUCTION);
      return "Gracias por tu consulta. Si necesitas más ayuda, no dudes en consultarme.";

    default:
      updateConversationStage(req, ConversationStages.INTRODUCTION);
      return askAgent(userInput.queryLLMBase);
  }
};
