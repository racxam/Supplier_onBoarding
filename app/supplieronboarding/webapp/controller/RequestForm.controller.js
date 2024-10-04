sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Icon",
    "sap/m/Link",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
],
    function (Controller, MessageToast, Icon, JSONModel, Fragment, Dialog, Button, Text) {
        "use strict";

        return Controller.extend("com.sumo.supplieronboarding.controller.RequestForm", {
            onInit: function () {
                // Initialize the model with an empty array for files
                var oModel = new sap.ui.model.json.JSONModel({ documentfiles: [] });
                this.getView().setModel(oModel);
                this.onReadSupplierSpendType();
                this.onReadNatureofActivity();
                this.onReadSector();
                this.onReadDepartments();

                var currentDate = new Date();
                var maxDate = new Date();
                maxDate.setFullYear(currentDate.getFullYear() + 4);

                var oDatePicker = this.byId("datePicker");

                oDatePicker.setMinDate(currentDate);
                oDatePicker.setMaxDate(maxDate);

                var oModel = new sap.ui.model.json.JSONModel({
                    panCardValue: "",
                    gstinValue: "",
                    emailValue: "",
                    numberValue: "",
                    pan: [],
                    gst: []
                });
                this.getView().setModel(oModel);
            },
            onPanCardChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                if (panCardPattern.test(sValue)) {
                    oInput.setValueState("Success");
                } else {
                    oInput.setValueState("Error");
                }
            },
            onGSTINChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sGSTIN = oInput.getValue();

                var gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                var sPanCard = this.getView().getModel().getProperty("/panCardValue");

                if (gstinPattern.test(sGSTIN)) {

                    var sGSTINPan = sGSTIN.substring(2, 12);

                    if (sGSTINPan === sPanCard) {
                        oInput.setValueState("Success");
                    } else {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.");
                    }
                } else {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid GSTIN format. Please enter a valid GSTIN.");
                }
            },

            onSubmitpan: function () {
                var oInput = this.byId("panInput");
                var sValue = oInput.getValue();

                if (oInput.getValueState() === "Success") {
                    MessageToast.show("PAN Card number is valid: " + sValue);
                } else {
                    MessageToast.show("Please enter a valid PAN Card number.");
                }
            },

            // onSubmitgst: function () {
            //     var oGSTINInput = this.byId("gstinInput");
            //     var sGSTINValue = oGSTINInput.getValue();

            //     if (oGSTINInput.getValueState() === "Success") {
            //         MessageToast.show("GSTIN are valid:" + sGSTINValue);
            //     } else {
            //         MessageToast.show("Please enter a valid GSTIN or Please ensure both PAN and GSTIN are valid and matching.");
            //     }
            // },

            onSubmitgst: function () {
                // Get the input value from the user
                var sGstinInput = this.byId("gstinInput").getValue().trim();

                // Access the model with customer data
                var oModel = this.getView().getModel("customerModel");
                var oData = oModel.getProperty("/customers");

                // Find customer based on GSTIN
                var oCustomer = oData.find(function (customer) {
                    return customer.GSTIN === sGstinInput;
                });

                if (oCustomer) {
                    // GSTIN found, show details in a dialog
                    var oDialog = new sap.m.Dialog({
                        title: "Customer Details",
                        content: new sap.m.Text({
                            text: "  Name: " + oCustomer.Name + "\n" +
                                "  Address: " + oCustomer.Address + "\n" +
                                "  Contact Number: " + oCustomer.ContactNumber
                        }),
                        beginButton: new sap.m.Button({
                            text: "OK",
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });

                    oDialog.open();
                } else {
                    // GSTIN not found, show message toast
                    MessageToast.show("GSTIN not found!");
                }
            },

            onEmailChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sEmail = oInput.getValue();


                var emailPattern = /^[a-zA-Z0-9!#$%&'*+?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;

                if (emailPattern.test(sEmail)) {
                    oInput.setValueState("Success");
                } else {
                    oInput.setValueState("Error");
                }
            },

            onSubmitemail: function () {
                var oEmailInput = this.byId("emailInput");
                var sEmailValue = oEmailInput.getValue();

                if (oEmailInput.getValueState() === "Success") {
                    MessageToast.show("Email is valid: " + sEmailValue);
                } else {
                    MessageToast.show("Please enter a valid email address.");
                }
            },

            onNumberChange: function (oEvent) {
                var oInput = oEvent.getSource();   // Get the input control
                var sValue = oInput.getValue();    // Get the current value of the input


                sValue = sValue.replace(/\D/g, '');  // This removes all non-numeric characters

                if (sValue.length > 10) {
                    sValue = sValue.substring(0, 10);  // Limit the string to 10 digits
                }

                oInput.setValue(sValue);

                if (sValue.length === 10) {
                    oInput.setValueState("Success");
                } else {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Mobile number must be 10 digits.");
                }
            },

            onSubmitnumber: function () {
                var oNumberInput = this.byId("numberInput");
                var sNumberValue = oNumberInput.getValue();

                if (oNumberInput.getValueState() === "Success") {
                    MessageToast.show("Number is valid: " + sNumberValue);
                } else {
                    MessageToast.show("Please enter a valid Mobile number.");
                }
            },

            onDownload: function (oEvent) {
                var oLink = oEvent.getSource();
                var sFileUrl = oLink.getCustomData()[0].getValue();  // Get the file's base64 URL
                var sFileName = oLink.getText();  // Get the file name from the link's text

                // Create a temporary <a> element to trigger the download
                var oAnchor = document.createElement("a");
                oAnchor.href = sFileUrl;  // Set the Data URL as the href
                oAnchor.download = sFileName;  // Set the download attribute with the file name

                // Append the anchor to the body (it needs to be in the DOM for a click event)
                document.body.appendChild(oAnchor);

                // Programmatically trigger the click event to start the download
                oAnchor.click();

                // Remove the anchor from the DOM after the download is triggered
                document.body.removeChild(oAnchor);
            },

            onDeleteFilepan: function (oEvent) {
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent().getParent();  // Get the item from the List
                var oModel = this.getView().getModel();
                var aFiles = oModel.getProperty("/pan");

                // Get the index of the item being deleted
                var iIndex = oItem.getBindingContext().getPath().split("/").pop();
                aFiles.splice(iIndex, 1);  // Remove the file from the array

                oModel.setProperty("/pan", aFiles);  // Update the model
                MessageToast.show("File deleted successfully.");
            },
            onDeleteFilegst: function (oEvent) {
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent().getParent();  // Get the item from the List
                var oModel = this.getView().getModel();
                var aFiles = oModel.getProperty("/gst");

                // Get the index of the item being deleted
                var iIndex = oItem.getBindingContext().getPath().split("/").pop();
                aFiles.splice(iIndex, 1);  // Remove the file from the array

                oModel.setProperty("/gst", aFiles);  // Update the model
                MessageToast.show("File deleted successfully.");
            },

            onFileUploadpan: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var oFile = oFileUploader.oFileUpload.files[0]; // Get the uploaded file

                if (oFile) {
                    var sFileName = oFile.name;
                    var oReader = new FileReader();
                    var that = this;

                    oReader.onload = function (e) {
                        var sFileUrl = e.target.result;  // Get the file's base64 data URL

                        // Add the file info to the model
                        var oModel = that.getView().getModel();
                        var aFiles = oModel.getProperty("/pan");  // Get current documentfiles array

                        aFiles.push({
                            fileName: sFileName,
                            fileUrl: sFileUrl
                        });

                        // Update the model with the new file
                        oModel.setProperty("/pan", aFiles);

                        // Log updated /files data to console
                        console.log("Updated /Pan attachment:", oModel.getProperty("/pan"));

                        // Show success message
                        MessageToast.show("File " + sFileName + " uploaded successfully.");

                        oModel.refresh(true);
                    };

                    oReader.readAsDataURL(oFile);  // Read the file as Data URL (base64)
                }
            },


            formatAttachmentButtonTextpan: function (pan) {
                if (pan && pan.length > 0) {
                    return "View Attachments (" + pan.length + ")";
                } else {
                    return "View Attachments (0)";
                }
            },

            // onAttachmentubmit: function () {
            //     var oModel = this.getOwnerComponent().getModel();
            //     var aFiles = oModel.getProperty("/pan");  // Retrieve the uploaded PAN file(s)
            //     console.log("Updated /Pan attachment:", oModel.getProperty("/pan"));

            //     // Prepare the payload for submission
            //     var oNewEntry = {
            //       //  Name: this.byId("inputName").getValue(), // Assuming you have other fields in the form
            //         PANFile: aFiles.length > 0 ? aFiles[0].fileUrl : "" // Sending the first PAN file's base64
            //     };

            //     // Use the OData create method
            //     oModel.setUseBatch(false);  // Disable batch mode for simplicity
            //     oModel.create("/attachmentsSrv", oNewEntry, {
            //         method: "POST",
            //         success: function (oData) {
            //             MessageToast.show("Form submitted successfully. ID: " + oData.ID);
            //         },
            //         error: function () {
            //             MessageToast.show("Error while submitting the Form.");
            //         }
            //     });
            // },



            // Open the dialog for PAN attachments
            onOpenDialogpan: function () {
                if (!this._oPanDialog) {
                    this._oPanDialog = this.getView().byId("panDialog");


                    if (!this._oPanDialog) {
                        this._oPanDialog = sap.ui.xmlfragment("com.sumo.supplieronboarding.view.fragment.uploadfile", this);
                        this.getView().addDependent(this._oPanDialog);
                    }
                }
                this._oPanDialog.open();
            },


            // Close the PAN dialog
            onCloseDialogpan: function () {
                if (this._oPanDialog) {
                    this._oPanDialog.close();
                }
            },


            onFormsubmit: function () {
                // Get the view
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                console.log(oModel);



                // var oFormData = {
                //     validity: oView.byId("datePicker").getDateValue(),
                //     relatedParty: oView.byId("radioGroup1").getSelectedButton().getText(),
                //     supplierSpendType: oView.byId("supplierSpendType").getSelectedKey(),
                //     natureOfActivity: oView.byId("NatureofActivity").getSelectedKey(),
                //     sector: oView.byId("sectorComboBox").getSelectedKeys(),
                //     FunctionandSubfunction: oView.byId("childMultiComboBox").getSelectedKeys(),
                //     panCardNumber: oView.byId("panInput").getValue(),
                //     gstinNumber: oView.byId("gstinInput").getValue(),
                //     supplierFullName: oView.byId("SupplierNameInput").getValue(),
                //     supplierTradeName: oView.byId("SuppliertradeNameInput").getValue(),
                //     supplierAddress: oView.byId("SupplierAddressInput").getValue(),
                //     supplierGstAddress: oView.byId("SupplierAddressgstInput").getValue(),
                //     primaryFirstName: oView.byId("PrimaryFirstnameInput").getValue(),
                //     primaryLastName: oView.byId("PrimaryLastnameInput").getValue(),
                //     primaryEmail: oView.byId("emailInput").getValue(),
                //     primaryPhone: oView.byId("numberInput").getValue()
                // };
                // if (oFormData.relatedParty === 'Yes') {
                //     oFormData.relatedParty = true;

                // }
                // else {
                //     oFormData.relatedParty = false;
                // }


                // var oNewEntry = {
                //     "DigressionVendorCodeVal": oFormData.validity,
                //     "IsRelPartyVCode": oFormData.relatedParty,
                //     "SpendType": oFormData.supplierSpendType,
                //     "NatureOfActivity": oFormData.natureOfActivity,
                //     "Sector": oFormData.sector,
                //     "FunAndSubfun": oFormData.FunctionandSubfunction,
                //     "PANCardNo": oFormData.panCardNumber,
                //     "GSTIN": oFormData.gstinNumber,
                //     "SFullName": oFormData.supplierFullName,
                //     "STradeNameGST": oFormData.supplierTradeName,
                //     "SAddress": oFormData.supplierAddress,
                //     "SAddressGST": oFormData.supplierGstAddress,
                //     "PriContactFName": oFormData.primaryFirstName,
                //     "PriContactLName": oFormData.primaryLastName,
                //     "PriContactEmail": oFormData.primaryEmail,
                //     "PriContactMNumber": oFormData.primaryPhone
                // };

                var oNewEntry = {
                    "DigressionVendorCodeVal": "2025-09-30",
                    "IsRelPartyVCode": true,
                    "SpendType": "Indirect",
                    "NatureOfActivity": "Material",
                    "Sector": ["IT", "Manufacturing"],
                    "FunAndSubfun": ["Finance", "HR"],
                    "PANCardNo": "ABCDE1234F",
                    "GSTIN": "27ABCDE1234F1Z5",
                    "SFullName": "ABC Corp Pvt. Ltd.",
                    "STradeNameGST": "ABC Trade",
                    "SAddress": "123, Example Street, City, State",
                    "SAddressGST": "123, Example Street, City, State",
                    "PriContactFName": "Sumit",
                    "PriContactLName": "Doe",
                    "PriContactEmail": "john.doe@example.com",
                    "PriContactMNumber": "1234567890"
                }

                // Output form data to the console (or process it further)
                // console.log(oFormData);
                // console.log(oNewEntry);

                // Use the OData create method
                oModel.setUseBatch(false);
                oModel.create("/supplierReqSrv", oNewEntry, {
                    method: "POST",
                    success: function (oData) {

                        MessageToast.show("Form submitted successfully." + oData.ID);
                        console.log(oData.ID);
                        this.onUploadFile(oData.ID);
                        console.log("---------->Upload");



                    }.bind(this),  // Ensure 'this' refers to the controller instance
                    error: function () {
                        MessageToast.show("Error while submitting the Form.");
                    }
                });


                // Show a success message (or handle the form data as needed)
                MessageToast.show("Form submitted successfully!");
                //this.oLabelInput.setValue("");
                //this.oFormData.FunctionandSubfunction.setValue("");

            },


            onUploadFile: function(ReqID) {
                console.log("On Upload file--------->");
            
                // Use arrow function for postAttachments
                const postAttachments = (attachments, ReqID) => {
                    attachments.forEach((attachment) => {
                        console.log("Control reached!!!");
                        var payLoad = {
                            Req_Supplier_ID: ReqID,
                            Doc_Type: "PAN",
                            Attachment_ID: attachment.attachmentId,
                            fileName: attachment.fileName,
                            mediaType: attachment.fileType,
                            content:attachment.fileContent,
                            Doc_Type:attachment.Doc_Type
                            // Assuming imageType refers to fileType
                        };
                        console.log(payLoad);
                        
                        var oModel = this.getOwnerComponent().getModel();
                        oModel.setUseBatch(false);
                        oModel.create("/SReqattachmentsSrv", payLoad, {
                            method: "POST",
                            success: function(oData) {
                                MessageToast.show("Attachments uploaded successfully: " + oData.ID);
                            }.bind(this),  // Ensure 'this' refers to the controller instance
                            error: function() {
                                MessageToast.show("Error while Uploading the Attachments.");
                            }
                        });
                    });
                };
            
                // Combine both arrays
                var localModel = this.getView().getModel();
                var docFiles = localModel.getProperty("/documentFiles");
                console.log(docFiles.pan);
                console.log(docFiles.gst);
                var allAttachments = docFiles.pan.concat(docFiles.gst);
                console.log(allAttachments);
                console.log(`++++++++++ ${allAttachments}++++++++++`);
            
                // Post all attachments
                postAttachments(allAttachments, ReqID);
            },
            
            onFileUpload: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var oFile = oFileUploader.oFileUpload.files[0];  // Get the uploaded file
            
                if (oFile) {
                    var sFileName = oFile.name;
                    var sFileType = sFileName.split('.').pop();  // Extract the file type
            
                    var oReader = new FileReader();
                    var that = this;
            
                    oReader.onload = function (e) {
                        var sFileUrl = e.target.result;  // Get the file's base64 data URL
                        console.log("Base64 File URL: ", sFileUrl);
            
                        var oModel = that.getView().getModel();
                        var oDocumentFiles = oModel.getProperty("/documentFiles") || { pan: [], gst: [], cin: [] };  // Initialize documentFiles object
            
                        // Get the current count for each document type (initialize if not present)
                        var panCount = oDocumentFiles.pan.length + 1;
                        var gstCount = oDocumentFiles.gst.length + 1;
                        var cinCount = oDocumentFiles.cin.length + 1;
            
                        // Determine the document type based on the uploader ID and assign counter
                        var uploaderId = oFileUploader.getId();
                        var documentType = "";
                        var attachmentId = "";  // For storing the ID
            
                        if (uploaderId.includes("fileUploaderPan")) {
                            documentType = "PAN";
                            attachmentId = "PAN-" + panCount;  // Simple counter for PAN
                            oDocumentFiles.pan.push({
                                fileName: sFileName,
                                fileUrl: sFileUrl,
                                fileContent: sFileUrl,
                                fileType: sFileType,
                                Doc_Type: 'PAN',
                                attachmentId: attachmentId  // Add counter-based attachment ID
                            });
                        } else if (uploaderId.includes("fileUploaderGst")) {
                            documentType = "GST";
                            attachmentId = "GST-" + gstCount;  // Simple counter for GST
                            oDocumentFiles.gst.push({
                                fileName: sFileName,
                                fileUrl: sFileUrl,
                                fileContent: sFileUrl,
                                fileType: sFileType,
                                Doc_Type: 'GST',
                                attachmentId: attachmentId  // Add counter-based attachment ID
                            });
                        } else if (uploaderId.includes("fileUploaderCin")) {
                            documentType = "CIN";
                            attachmentId = "CIN-" + cinCount;  // Simple counter for CIN
                            oDocumentFiles.cin.push({
                                fileName: sFileName,
                                fileUrl: sFileUrl,
                                fileContent: sFileUrl,
                                fileType: sFileType,
                                Doc_Type: 'CIN',
                                attachmentId: attachmentId  // Add counter-based attachment ID
                            });
                        }
            
                        // Update the model with the new document files
                        oModel.setProperty("/documentFiles", oDocumentFiles);
                        console.log("Updated /documentFiles:", oModel.getProperty("/documentFiles"));
            
                        // Show success message
                        MessageToast.show(documentType + " file " + sFileName + " uploaded successfully.");
                        oModel.refresh(true);
                    };
            
                    oReader.readAsDataURL(oFile);  // Read the file as Data URL (base64)
                }
            },
            
            formatAttachmentButtonText: function (aDocumentFiles, documentType) {
                // Ensure that aDocumentFiles is defined
                aDocumentFiles = aDocumentFiles || [];

                // Return the formatted button text based on the number of attachments
                return "View Attachments (" + aDocumentFiles.length + ")";
            },


            onOpenDialog: function (documentType) {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.sumo.supplieronboarding.view.fragment.uploadfile", this);
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

                // Fetch the file content from the JSON model
                var aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType);
                var oFile = aDocumentFiles.find(file => file.fileName === sFileName);

                console.log("Selected File: ", oFile); // Log to see what the selected file object looks like

                if (oFile && oFile.fileContent) {
                    // Create a blob and trigger download
                    const blob = this._base64ToBlob(oFile.fileContent);
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = sFileName;
                    link.click();
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
            },


            onReadSector: function () {
                console.log("I am sector srv");
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/SectorSrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("sectorComboBox").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadNatureofActivity: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/NatureOfActivitySrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("NatureofActivity").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },
            onReadSupplierSpendType: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/SupplierSpendTypeSrv", {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().byId("supplierSpendType").setModel(jModel);

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                })
            },

            onSave: function () {
                var oView = this.getView();

                // Collect form data
                var oFormData = {
                    validity: oView.byId("datePicker").getDateValue(),
                    relatedParty: oView.byId("radioGroup").getSelectedButton().getText(),
                    supplierSpendType: oView.byId("supplierSpendType").getSelectedKey(),
                    natureOfActivity: oView.byId("NatureofActivity").getSelectedKey(),
                    sector: oView.byId("sectorComboBox").getSelectedKeys().join(", "),
                    FunctionandSubfunction: oView.byId("childMultiComboBox").getSelectedKeys(),
                    panCardNumber: oView.byId("panInput").getValue(),
                    gstinNumber: oView.byId("gstinInput").getValue(),
                    supplierFullName: oView.byId("SupplierNameInput").getValue(),
                    supplierTradeName: oView.byId("SuppliertradeNameInput").getValue(),
                    supplierAddress: oView.byId("SupplierAddressInput").getValue(),
                    supplierGstAddress: oView.byId("SupplierAddressgstInput").getValue(),
                    primaryFirstName: oView.byId("PrimaryFirstnameInput").getValue(),
                    primaryLastName: oView.byId("PrimaryLastnameInput").getValue(),
                    primaryEmail: oView.byId("emailInput").getValue(),
                    primaryPhone: oView.byId("numberInput").getValue()
                };


                // Create a string representation of the form data
                // var sFormDataText = `
                //     Validity: ${oFormData.validity}
                //     Related Party: ${oFormData.relatedParty}
                //     Supplier Spend Type: ${oFormData.supplierSpendType}
                //     Nature of Activity: ${oFormData.natureOfActivity}
                //     Sector: ${oFormData.sector}
                //     Function and Subfunction: ${oFormData.FunctionandSubfunction}
                //     PAN Card Number: ${oFormData.panCardNumber}
                //     GSTIN Number: ${oFormData.gstinNumber}
                //     Supplier Full Name: ${oFormData.supplierFullName}
                //     Supplier Trade Name: ${oFormData.supplierTradeName}
                //     Supplier Address: ${oFormData.supplierAddress}
                //     Supplier GST Address: ${oFormData.supplierGstAddress}
                //     Primary Contact First Name: ${oFormData.primaryFirstName}
                //     Primary Contact Last Name: ${oFormData.primaryLastName}
                //     Primary Email: ${oFormData.primaryEmail}
                //     Primary Phone: ${oFormData.primaryPhone}
                // `;

                // Convert the form data object to a JSON string
                var sFormData = JSON.stringify(oFormData);

                // Store the form data in localStorage
                localStorage.setItem("formData", sFormData);

                console.log(oFormData);


                // Confirmation message
                MessageToast.show("Form data saved successfully in local storage.");

                // // Create the dialog to show form data
                // var oDialog = new sap.m.Dialog({
                //     title: "Form Data",
                //     content: new sap.m.Text({ text: sFormDataText }),
                //     beginButton: new sap.m.Button({
                //         text: "Close",
                //         press: function () {
                //             oDialog.close();
                //         }
                //     }),
                //     afterClose: function () {
                //         oDialog.destroy();
                //     }
                // });

                // // Open the dialog
                // oDialog.open();
            },

            // // Function to fetch department data
            // onReadDepartments: function () {
            //     var that = this;
            //     var oModel = this.getOwnerComponent().getModel();  // Assuming your OData model is set on the component

            //     // Fetch the department data from OData service
            //     oModel.read("/departmentsSrv", {
            //         success: function (oData) {
            //             console.log("Departments Data:", oData);

            //             // Create a JSON model with the data from OData service
            //             var jModel = new sap.ui.model.json.JSONModel(oData);

            //             // Set the model to the view so that the Select (ComboBox) can use it
            //             that.getView().setModel(jModel, "departmentsModel");
            //         },
            //         error: function (oError) {
            //             console.log("Error fetching departments data:", oError);
            //         }
            //     });
            // },
            onReadDepartments: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();  // Assuming your OData model is set on the component

                // Fetch the department data from OData service
                oModel.read("/departmentsSrv", {
                    success: function (oData) {
                        console.log("Departments Data:", oData);

                        // Create a JSON model with the data from OData service
                        var jModel = new sap.ui.model.json.JSONModel(oData);

                        // Set the model to the view so that the Select (ComboBox) can use it
                        that.getView().setModel(jModel, "departmentsModel");

                        // Select the first department programmatically
                        var oSelect = that.getView().byId("FunctionandSubfunctionComboBox");
                        var aItems = oSelect.getItems();

                        if (aItems && aItems.length > 0) {
                            // Set the first item as selected
                            oSelect.setSelectedItem(aItems[0]);

                            // Manually trigger the onDepartmentChange method
                            that.onDepartmentChange({
                                getParameter: function () {
                                    return aItems[0];
                                }
                            });
                        }
                    },
                    error: function (oError) {
                        console.log("Error fetching departments data:", oError);
                    }
                });
            },

            // Function triggered when a department is selected
            onDepartmentChange: function (oEvent) {
                var that = this;

                // Get the selected department's context
                var selectedItem = oEvent.getParameter("selectedItem");
                console.log("Selected Item:", selectedItem);

                if (selectedItem) {
                    // Get the selected department's object from the model
                    var selectedDepartment = selectedItem.getBindingContext("departmentsModel").getObject();

                    console.log("Selected Department:", selectedDepartment);

                    if (selectedDepartment.Functions && selectedDepartment.Functions.length > 0) {
                        console.log("Functions:", selectedDepartment.Functions);  // Check if functions are populated
                        var functionsModel = new sap.ui.model.json.JSONModel({ Functions: selectedDepartment.Functions });
                        that.getView().byId("childMultiComboBox").setModel(functionsModel, "functionsModel");
                    } else {
                        console.log("No functions available for the selected department.");
                    }

                };
            }
        });
    });