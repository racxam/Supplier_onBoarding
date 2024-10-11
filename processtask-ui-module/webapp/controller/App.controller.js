sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Icon",
    "sap/m/Link",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
  ],
  function (BaseController, JSONModel, MessageToast, MessageBox, Icon, Link, Fragment, Dialog, Button, Text) {
    "use strict";

    return BaseController.extend("com.sumo.processtaskuimodule.controller.App", {
      onInit: function () {

        // Initialize the model with an empty array for files
        var oModel = new sap.ui.model.json.JSONModel({ documentfiles: [] });
        this.getView().setModel(oModel);

        this.onReadform();
        this.onReadAttachments();
      },



      onReadform: function () {
        var oView = this.getView();
        var oText = oView.byId("requestId");
        var RequestID = oText.getText();

        console.log("Req ID Value: " + RequestID);

        var that = this;
        var oModel = this.getOwnerComponent().getModel();
        var oFilter = new sap.ui.model.Filter('ID', 'EQ', RequestID);
        console.log("filter" + oFilter);
        // Read the OData service and fetch data
        oModel.read("/supplierReqSrv", {
          filters: [oFilter],
          success: function (oData) {
            console.log("my form data", oData);

            // Check if results array exists and has data
            if (oData && oData.results && oData.results.length > 0) {
              // Set the model with the first result object
              var jModel = new sap.ui.model.json.JSONModel(oData.results[0]);
              // Set the model to the List
              that.getView().byId("requestFormList").setModel(jModel);
              console.log("my form data request submit", jModel);
            } else {
              console.warn("No data found in results.");
            }
          },
          error: function (oError) {
            console.error("Error fetching data", oError);
          }
        });
      },

      onReadAttachments: function () {
        var that = this;
        var oView = this.getView();
        var oModel = this.getOwnerComponent().getModel();
        var oText = oView.byId("requestId");
        var RequestID = oText.getText();

        var oFilter = new sap.ui.model.Filter('Req_Supplier_ID', 'EQ', RequestID);

        oModel.read("/SReqattachmentsSrv", {
          filters: [oFilter],
          success: function (oData) {
            if (oData && oData.results && oData.results.length > 0) {
              var attachments = oData.results;

              // Filter attachments by document type (PAN, GST, CIN)
              var oDocumentFiles = {
                pan: attachments.filter(att => att.Doc_Type === 'PAN'),
                gst: attachments.filter(att => att.Doc_Type === 'GST'),
                cin: attachments.filter(att => att.Doc_Type === 'CIN')
              };

              // Update the local model with the filtered data
              var localModel = that.getView().getModel();
              localModel.setProperty("/documentFiles", oDocumentFiles);
              console.log("Updated /documentFiles:", localModel.getProperty("/documentFiles"));

            } else {
              console.warn("No data found in results.");
            }
          },
          error: function (oError) {
            console.error("Error fetching data", oError);
          }
        });
      },

      formatAttachmentButtonText: function (aDocumentFiles, documentType) {
        // Ensure that aDocumentFiles is defined and not empty
        aDocumentFiles = aDocumentFiles || [];

        // Return the formatted button text based on the number of attachments
        return "View Attachments (" + aDocumentFiles.length + ")";
      },

      onOpenDialog: function (documentType) {
        if (!this._oDialog) {
          this._oDialog = sap.ui.xmlfragment("com.sumo.processtaskuimodule.view.fragment.uploadfile", this);
          this.getView().addDependent(this._oDialog);
        }

        // Get the document files for the specific document type (e.g., PAN, GST, CIN)
        var oModel = this.getView().getModel();
        var aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType) || [];

        // Set the filtered document files to the dialog's list model
        var oDialogModel = new sap.ui.model.json.JSONModel({ documentFiles: aDocumentFiles });
        this._oDialog.setModel(oDialogModel);

        // Set the document type in the dialog's data for future use (e.g., download, delete)
        this._oDialog.data("documentType", documentType);

        // Open the dialog
        this._oDialog.open();
      },

      onCloseDialog: function () {
        if (this._oDialog) {
          this._oDialog.close();
        }
      },

      onDownloadFile: function (oEvent) {
        const sFileName = oEvent.getSource().data("fileName");
        const documentType = this._oDialog.data("documentType");

        var oModel = this.getView().getModel(); // Assuming this is a JSONModel

        // Fetch the file metadata from the JSON model
        var aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType);
        var oFile = aDocumentFiles.find(file => file.fileName === sFileName);

        console.log("Selected File: ", oFile); // Log to see what the selected file object looks like

        if (oFile && oFile.__metadata && oFile.__metadata.media_src) {
          // Fetch the file content from the media_src URL
          var sUrl = oFile.__metadata.media_src;

          fetch(sUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error("File format not supported or file unavailable");
              }
              return response.blob(); // Get the file content as a Blob
            })
            .then(blob => {
              // Check the file's MIME type to ensure it's downloadable
              const mimeType = blob.type || "application/octet-stream"; // Fallback to a generic type
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = sFileName;  // Set filename for download
              link.click();
            })
            .catch(error => {
              console.error("Error fetching file content: ", error);
              MessageToast.show("Error downloading file: Unsupported format or unavailable.");
            });
        } else {
          MessageToast.show("File not found or missing content.");
        }
      },


      onDeleteFile: function (oEvent) {
        const sFileName = oEvent.getSource().data("fileName");
        const documentType = this._oDialog.data("documentType");

        // Confirm and delete file
        sap.m.MessageBox.confirm(`Are you sure you want to delete the file "${sFileName}"?`, {
          onClose: function (oAction) {
            if (oAction === "OK") {
              // Get the current model and document files
              const oModel = this.getView().getModel();
              const aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType);

              // Filter out the file to be deleted
              const updatedDocumentFiles = aDocumentFiles.filter(file => file.fileName !== sFileName);

              // Update the model with the new list
              oModel.setProperty("/documentFiles/" + documentType, updatedDocumentFiles);

              // Show success message
              MessageToast.show(`File "${sFileName}" deleted successfully.`);
              // Close the dialog
              this.onCloseDialog();
            }
          }.bind(this)
        });
      },



      // Utility function to convert base64 to blob
      _base64ToBlob: function (base64) {
        // Strip the prefix if present
        if (base64.startsWith("data:")) {
          base64 = base64.split(",")[1]; // Get the part after the comma
        }

        // Log the base64 string for debugging
        console.log("Base64 String: ", base64);

        // Try-catch for base64 decoding
        try {
          const byteCharacters = atob(base64);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          return new Blob(byteArrays, { type: "application/octet-stream" });
        } catch (error) {
          console.error("Base64 decoding failed: ", error);
          return null; // Handle the error
        }
      }

    });
  });

