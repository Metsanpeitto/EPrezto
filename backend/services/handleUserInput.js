const { plateRegex, emailRegex, nameRegex } = require("../constants/regex");
const { ConversationStages } = require("../constants/conversationStages");
const {
  fetchCustomerByPlate,
  fetchCustomerByEmail,
  fetchCustomerByName,
} = require("../services/agentHelper");
const { askAgent } = require("../services/askAgent");
const { queryLLMBase, queryLLMActionYesOrNo, queryLLMSuggestion } = require("../services/queries")
const { filterSuggestion } = require('../utils/filterSuggestion')

const conversationState = {
  stage: ConversationStages.INTRODUCTION,
  policyData: null,
  policyLink: null,
};

const PREGUNTA_OTRA_ACCION =
  "¿Deseas realizar otra acción? Puedo ayudarte a completar el pago o proporcionarte más información sobre la póliza.";

const processPolicyData = (policyStatus, policyMessage, policyLink) => {
  conversationState.policyLink = policyLink;
  conversationState.stage = ConversationStages.ACTION_REQUEST;
  if (policyStatus && policyMessage) {
    return `${policyMessage}. Quisieras emitir la poliza?`;
  }
  if (!policyStatus && policyMessage) {
    return policyMessage;
  }
};

const processPolicyDataResponse = (typeOfInput) => {
  const { policyStatus, policyMessage, policyLink } =
    conversationState.policyData;

  if (policyStatus || policyMessage) {
    const policyDataResponse = processPolicyData(policyStatus, policyMessage, policyLink);
    return this.handleUserInput(policyDataResponse)
  }
  if (!policyStatus && !policyMessage) {
    conversationState.stage = ConversationStages.DATA_REQUEST;
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


exports.handleUserInput = async (userInput) => {
  switch (conversationState.stage) {
    // Respond with a greeting and request for identification
    case ConversationStages.INTRODUCTION:
      const introductionResponse =
        "Buenos días, por favor bríndame el número de placa del auto, email o nombre del cliente.";
      conversationState.stage = ConversationStages.DATA_REQUEST; // Move to next stage
      return introductionResponse;

    // Check if the input contains plate number, email, or name
    case ConversationStages.DATA_REQUEST:
      // Fetch customer data based on plate number
      if (userInput.match(plateRegex)) {
        const plate = userInput.match(plateRegex);
        conversationState.policyData = await fetchCustomerByPlate(plate[0]);
        return processPolicyDataResponse("plate");
      }
      // Fetch customer data based on email
      if (userInput.match(emailRegex)) {
        const email = userInput.match(emailRegex[0]);
        conversationState.policyData = await fetchCustomerByEmail(email);
        return processPolicyDataResponse("email");
      }
      // Fetch customer data based on name
      if (userInput.match(nameRegex)) {
        const name = userInput.match(nameRegex[0]);
        conversationState.policyData = await fetchCustomerByName(name);
        return processPolicyDataResponse("name");
      }
      conversationState.stage = ConversationStages.DATA_REQUEST;
      return `No se encontró ninguna informacion.
              Por favor proporciona un número de placa, email o nombre del cliente válidos.`;

    case ConversationStages.ACTION_REQUEST:
      try {
        conversationState.stage = ConversationStages.ACTION_CONFIRMATION;
        const responseSuggestedAction = await askAgent(userInput, queryLLMSuggestion);
        console.log(responseSuggestedAction)
        const filteredResponse = filterSuggestion(responseSuggestedAction)
        return filteredResponse
      } catch (error) {
        console.log(error)
        return error
      }

    case ConversationStages.ACTION_CONFIRMATION:
      // Suggest actions based on customer data
      try {
        const negativeOrPositiveAnswer = await askAgent(userInput, queryLLMActionYesOrNo);
        if (negativeOrPositiveAnswer === "Si" || userInput.toLowerCase() === "si") {
          const policyLink = conversationState.policyLink;
          conversationState.stage = ConversationStages.CONCLUSION;
          if (policyLink) {
            return `Este es el link a la póliza: ${policyLink}.
            ${PREGUNTA_OTRA_ACCION}`;
          }
          return PREGUNTA_OTRA_ACCION;
        }

        if (negativeOrPositiveAnswer === "No" || userInput.toLowerCase() === "no") {
          conversationState.stage = ConversationStages.CONCLUSION;
          this.handleUserInput()
        }
      } catch (error) {
        console.log(error)
        return error
      }

    case ConversationStages.CONCLUSION:
      // Conclude the conversation
      conversationState.stage = ConversationStages.INTRODUCTION;
      return "Gracias por tu consulta. Si necesitas más ayuda, no dudes en consultarme.";

    default:
      conversationState.stage = ConversationStages.INTRODUCTION;
      return askAgent(userInput.queryLLMBase);
  }
};
