
import { showToast } from "@/store/slices/uiSlice";

export const notifyError = (dispatch, message) => {
  dispatch(showToast({ type: "error", message }));
};

export const handleViewDocument = (doc, dispatch) => {
  console.log("doc",doc);
  
  let fileUrl = "";
  let shouldRevoke = false;

  try {
    // Case 1: Local File object
    if (doc instanceof File) {
      fileUrl = URL.createObjectURL(doc);
      shouldRevoke = true;
    }

    // Case 2: Existing backend Base64 document
    else if (doc?.document) {
      const matches = doc.document.match(
        /^data:(.*?);base64,(.*)$/
      );

      if (!matches) {
        notifyError(dispatch, "Invalid document format.");
        return;
      }

      const mimeType =
        doc.documentContentType || matches[1];

      const byteCharacters = atob(matches[2]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = Array.from(slice, (char) =>
          char.charCodeAt(0)
        );

        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const blob = new Blob(byteArrays, {
        type: mimeType,
      });

      fileUrl = URL.createObjectURL(blob);
      shouldRevoke = true;
    }

    if (!fileUrl) {
      notifyError(dispatch, "Document is not available.");
      return;
    }

    // Open synchronously to avoid popup blocking
    const newWindow = window.open(fileUrl, "_blank");

    if (!newWindow) {
      notifyError(dispatch, "Please allow pop-ups to view the document.");
    }

    if (shouldRevoke) {
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 60000);
    }
  } catch (error) {
    console.error("Document viewing error:", error);
    notifyError(dispatch, "Unable to open document.");
  }
};
