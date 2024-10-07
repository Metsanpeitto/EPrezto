const filterSuggestion = (responseSuggestedAction) => {
  if (typeof responseSuggestedAction === "string") {
    const filteredResponse = responseSuggestedAction.replace(
      "Query: ",
      ""
    ).replace('Respuesta:', '')

    return filteredResponse;
  }
  return responseSuggestedAction;
};

module.exports = {
  filterSuggestion,
};
