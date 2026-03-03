import { useEffect } from "react";

// Notification: mostra un messaggio Bootstrap che scompare dopo un timeout
// Props:
//   message — testo da mostrare
//   type    — tipo di alert Bootstrap (es. "warning", "success", "danger", "info")
//   onDismiss — callback chiamata quando la notifica deve scomparire
const Notification = ({ message, type = "info", onDismiss }) => {

  /**
   *   Avvia un timer: dopo 3 secondi chiama onDismiss per nascondere la notifica
   *
   *   Cleanup: se il componente viene smontato prima che il timer scada
   *   (es. l'utente clicca la X), cancelliamo il timer con clearTimeout
   *   per evitare memory leak e warning di React.
   *   il ritorno del sideeffect viene eseguito quando il componente viene smontato
   *   quindi viene eseguito cleanup
   *   notificationEffect / cleanup sono totalmente ridondanti, ma usati solo a scopo dimostrativo
   * @returns {cleanup}
   */
  const notificationEffect = () =>{
    const timerId = setTimeout(() => {onDismiss();}, 3000);
    const cleanup = ()=>{ clearTimeout(timerId);}
    return cleanup
  }

  useEffect(notificationEffect, [onDismiss]);

  return (
    <div className={`alert alert-${type} alert-dismissible fade show m-3`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Chiudi"
        onClick={onDismiss}
      />
    </div>
  );
};

export default Notification;
