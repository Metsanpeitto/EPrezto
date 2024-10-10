const POLICY_URL = `Este es el link a la póliza: https://emisorweb.segurossura.com.pa/pls/sura/pkg_nube_seguros.caratula_auto?p_ramo =02 & p_sub_ramo=85 & p_poliza=1011927 & p_secuencia=0 & p_endoso=0 & p_asegurado=02 - 123 - 875.
            ¿Deseas realizar otra acción? Puedo ayudarte a completar el pago o proporcionarte más información sobre la póliza.`;
const MOCKED_URL = `https://emisorweb.segurossura.com.pa/pls/sura/pkg_nube_seguros.caratula_auto?p_ramo=02&p_sub_ramo=85&p_poliza=1011927&p_secuencia=0&p_endoso=0&p_asegurado=02-123-875`;
const SEARCH_STRING = "& p_endoso=0 & p_asegurado=02";

export const formatMessageWithLinks = (message) => {
  if (message === POLICY_URL || message.includes(SEARCH_STRING)) {
    return (
      <div>
        Este es el link a la póliza:
        <br />
        <a
          className="url"
          href={`${MOCKED_URL}`}
          target="_blank"
        >{`${MOCKED_URL}`}</a>
        <br />
        ¿Deseas realizar otra acción? Puedo ayudarte a completar el pago o
        proporcionarte más información sobre la póliza.
      </div>
    );
  }

  return <div>{`${message}`}</div>;
};
