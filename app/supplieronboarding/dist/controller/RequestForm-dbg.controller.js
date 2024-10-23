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
    "sap/m/Text",
    "sap/ui/model/odata/v4/ODataModel"
],
    function (Controller, MessageToast, MessageBox, Icon, JSONModel, Fragment, Dialog, Button, Text) {
        "use strict";

        return Controller.extend("com.sumo.supplieronboarding.controller.RequestForm", {
            onInit: function () {
                //this.uploadfile = sap.ui.xmlfragment("com/sumo/supplieronboarding/Fragments/uploadfile", this);
                //this.getView().addDependent(this.uploadfile);
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
                var sValue = oInput.getValue().toUpperCase(); 
                sValue = sValue.replace(/[^A-Z0-9]/g, '');
                oInput.setValue(sValue);
                if (this._panCardDebounceTimeout) {
                    clearTimeout(this._panCardDebounceTimeout);
                }
                this._panCardDebounceTimeout = setTimeout(function () {
                    if (sValue.length === 10) {
                        var panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                        if (panCardPattern.test(sValue)) {
                            oInput.setValueState("Success");
                            oInput.setValueStateText("");
                        } else {
                            oInput.setValueState("Error");
                            oInput.setValueStateText("Invalid PAN format. It should be 5 letters, 4 numbers, and 1 letter.");
                        }
                    } else {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("PAN must be exactly 10 characters long.");
                    }
                }, 1000);
            },

            onGSTINChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue().toUpperCase();
                sValue = sValue.replace(/[^A-Z0-9]/g, '');
                oInput.setValue(sValue);

                var sPanCard = this.getView().getModel().getProperty("/panCardValue");
                if (this._gstinDebounceTimeout) {
                    clearTimeout(this._gstinDebounceTimeout);
                }
                this._gstinDebounceTimeout = setTimeout(function () {
                    if (sValue.length === 15) {
                        var gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;  // GSTIN format

                        if (gstinPattern.test(sValue)) {
                            var sGSTINPan = sValue.substring(2, 12);
                            if (sGSTINPan === sPanCard) {
                                oInput.setValueState("Success");
                                oInput.setValueStateText("");
                            } else {
                                oInput.setValueState("Error");
                                oInput.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.");
                            }
                        } else {
                            oInput.setValueState("Error");
                            oInput.setValueStateText("Invalid GSTIN format. It should be 15 characters long with the correct structure.");
                        }
                    } else {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("GSTIN must be exactly 15 characters long.");
                    }
                }, 1000);
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

            onSubmitgst: function () {
                var gstin = this.getView().byId("gstinInput").getValue();

                if (gstin) {
                    this.verifyGST(gstin);
                } else {
                    MessageBox.error("Please enter a valid GSTIN.");
                }
            },
            verifyGST: function (gstin) {
                var oModel = this.getView().getModel("V4odataService");

                oModel.bindContext("/getStatus()", {
                    urlParameters: {
                        gstin: gstin
                    }
                }).requestObject().then(function (oData) {
                    this._onpopulate(oData);
                    console.log("API data:", oData);
                }.bind(this)).catch(function (oError) {
                    console.error("Error calling backend API:", oError);
                    MessageBox.error("Error fetching GST details. Please try again.");
                }.bind(this));
            },

            _onpopulate: function (oData) {
                this.getView().byId("SupplierNameInput").setValue(oData.value.data.lgnm);
                this.getView().byId("SuppliertradeNameInput").setValue(oData.value.data.tradeNam);
            },

            onEmailChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sEmail = oInput.getValue();
                sEmail = sEmail.replace(/\s+/g, "");
                oInput.setValue(sEmail);

                if (this._emailDebounceTimeout) {
                    clearTimeout(this._emailDebounceTimeout);
                }
                this._emailDebounceTimeout = setTimeout(function () {
                    var emailPattern = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;
                    if (sEmail === "" || !emailPattern.test(sEmail)) {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("Invalid Email format. Please enter a valid Email.");
                    } else {
                        oInput.setValueState("Success");
                    }
                }, 1000);
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
                var oInput = oEvent.getSource(); 
                var sValue = oInput.getValue(); 

                sValue = sValue.replace(/\D/g, '');

                if (sValue.length > 10) {
                    sValue = sValue.substring(0, 10);
                }

                oInput.setValue(sValue);
                if (this._numberDebounceTimeout) {
                    clearTimeout(this._numberDebounceTimeout);
                }
                this._numberDebounceTimeout = setTimeout(function () {
                    if (sValue.length === 10) {
                        oInput.setValueState("Success");
                    } else {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("Invalid Number. Please enter a valid Mobile Number.");
                    }
                }, 1000);
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
                var sFileUrl = oLink.getCustomData()[0].getValue();
                var sFileName = oLink.getText(); 
                var oAnchor = document.createElement("a");
                oAnchor.href = sFileUrl;
                oAnchor.download = sFileName;
                document.body.appendChild(oAnchor);
                oAnchor.click();
                document.body.removeChild(oAnchor);
            },

            onDeleteFilepan: function (oEvent) {
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent().getParent();
                var oModel = this.getView().getModel();
                var aFiles = oModel.getProperty("/pan");
                var iIndex = oItem.getBindingContext().getPath().split("/").pop();
                aFiles.splice(iIndex, 1);
                oModel.setProperty("/pan", aFiles); 
                MessageToast.show("File deleted successfully.");
            },

            onDeleteFilegst: function (oEvent) {
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent().getParent();
                var oModel = this.getView().getModel();
                var aFiles = oModel.getProperty("/gst");
                var iIndex = oItem.getBindingContext().getPath().split("/").pop();
                aFiles.splice(iIndex, 1);
                oModel.setProperty("/gst", aFiles);
                MessageToast.show("File deleted successfully.");
            },

            onFormsubmit: function () {
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                var bValid = true;
                var oFormData = {
                    validity: oView.byId("datePicker").getValue(),
                    relatedParty: oView.byId("radioGroup").getSelectedButton(),
                    supplierSpendType: oView.byId("supplierSpendType").getSelectedKey(),
                    natureOfActivity: oView.byId("NatureofActivity").getSelectedKey(),
                    sector: oView.byId("sectorComboBox").getSelectedKeys(),
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
                    primaryPhone: oView.byId("numberInput").getValue(),
                    panattachment: oView.byId("fileUploaderPan").getValue(),
                    gstattachment: oView.byId("fileUploaderGst").getValue()
                };

            
                function validateField(oView, fieldId, value, errorMessage, bValid) {
                    if (!value || (typeof value === 'string' && value.trim() === "") || value.length === 0) {
                        oView.byId(fieldId).setValueState(sap.ui.core.ValueState.Error).setValueStateText(errorMessage);
                        return false;  
                    } else {
                        oView.byId(fieldId).setValueState(sap.ui.core.ValueState.None);
                        return bValid;
                    }
                }

                bValid = validateField(oView, "datePicker", oFormData.validity, "Date is required", bValid);
                bValid = validateField(oView, "supplierSpendType", oFormData.supplierSpendType, "Supplier Spend Type is required", bValid);
                bValid = validateField(oView, "NatureofActivity", oFormData.natureOfActivity, "Nature of Activity is required", bValid);
                bValid = validateField(oView, "sectorComboBox", oFormData.sector, "At least one sector is required", bValid);
                bValid = validateField(oView, "childMultiComboBox", oFormData.FunctionandSubfunction, "At least one function/subfunction is required", bValid);
                bValid = validateField(oView, "fileUploaderPan", oFormData.panattachment, "PAN Card Attachment is required", bValid);
                bValid = validateField(oView, "fileUploaderGst", oFormData.gstattachment, "GST Attachment is required", bValid);
                bValid = validateField(oView, "SupplierNameInput", oFormData.supplierFullName, "Supplier Full Name is required and cannot be only spaces.", bValid);
                bValid = validateField(oView, "SuppliertradeNameInput", oFormData.supplierTradeName, "Supplier Trade Name is required and cannot be only spaces.", bValid);
                bValid = validateField(oView, "SupplierAddressInput", oFormData.supplierAddress, "Supplier Address is required and cannot be only spaces.", bValid);
                bValid = validateField(oView, "SupplierAddressgstInput", oFormData.supplierGstAddress, "Supplier GST Address is required and cannot be only spaces.", bValid);
                bValid = validateField(oView, "PrimaryFirstnameInput", oFormData.primaryFirstName, "Primary First Name is required and cannot be only spaces.", bValid);
                bValid = validateField(oView, "PrimaryLastnameInput", oFormData.primaryLastName, "Primary Last Name is required and cannot be only spaces.", bValid);


                if (!oFormData.panCardNumber || oFormData.panCardNumber.trim() === "") {
                    oView.byId("panInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Number is required");
                    bValid = false;
                } else {
                    var sPanCard = oFormData.panCardNumber.trim();
                    // PAN format: 5 letters, 4 digits, 1 letter (e.g., AAAAA9999A)
                    var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                    if (!panPattern.test(sPanCard)) {
                        oView.byId("panInput").setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Invalid PAN Card Number format. PAN should be in the format AAAAA9999A.");
                        bValid = false;
                    } else {
                        oView.byId("panInput").setValueState(sap.ui.core.ValueState.None);
                    }
                }

                if (!oFormData.gstinNumber || oFormData.gstinNumber.trim() === "") {
                    var gstinInput = oView.byId("gstinInput");
                    if (gstinInput) {
                        gstinInput.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("GSTIN Number is required");
                    }
                    bValid = false;
                } else {
                    var sGstinNumber = oFormData.gstinNumber.trim();
                    var gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[0-9]{1}$/;
                    if (!gstinPattern.test(sGstinNumber)) {
                        var gstinInput = oView.byId("gstinInput");
                        if (gstinInput) {
                            gstinInput.setValueState(sap.ui.core.ValueState.Error)
                                .setValueStateText("Invalid GSTIN Number format. It should be in the format 12ABCDE3456Z1Z5.");
                        }
                        bValid = false;
                    } else {
                        var gstinInput = oView.byId("gstinInput");
                        if (gstinInput) {
                            gstinInput.setValueState(sap.ui.core.ValueState.None);
                        }
                        var sGSTINPan = sGstinNumber.substring(2, 12);
                        var sPanCard = oFormData.panCardNumber;

                        if (sGSTINPan === sPanCard) {
                            gstinInput.setValueState(sap.ui.core.ValueState.Success);
                            gstinInput.setValueStateText(""); 
                        } else {
                            gstinInput.setValueState(sap.ui.core.ValueState.Error);
                            gstinInput.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.");
                            bValid = false;
                        }
                    }
                }

                if (!oFormData.primaryEmail || oFormData.primaryEmail.trim() === "") {
                    oView.byId("emailInput").setValueState(sap.ui.core.ValueState.Error)
                        .setValueStateText("Primary Email is required");
                    bValid = false;
                } else {
                    var sEmail = oFormData.primaryEmail.trim().replace(/\s+/g, "");
                    var emailPattern = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;

                    if (!emailPattern.test(sEmail)) {
                        oView.byId("emailInput").setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Invalid Primary Email format. Please enter a valid email.");
                        bValid = false;
                    } else {
                        oView.byId("emailInput").setValueState(sap.ui.core.ValueState.None);
                    }
                }

                if (!oFormData.primaryPhone || oFormData.primaryPhone.trim() === "") {
                    var numberInput = oView.byId("numberInput");
                    if (numberInput) {
                        numberInput.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Primary Phone Number is required");
                    }
                    bValid = false;
                } else {
                    var sPhoneNumber = oFormData.primaryPhone.trim();
                    var phonePattern = /^[0-9]{10}$/; 
                    if (!phonePattern.test(sPhoneNumber)) {
                        var numberInput = oView.byId("numberInput");
                        if (numberInput) {
                            numberInput.setValueState(sap.ui.core.ValueState.Error)
                                .setValueStateText("Invalid Phone Number. It should be 10 digits.");
                        }
                        bValid = false;
                    } else {
                        var numberInput = oView.byId("numberInput");
                        if (numberInput) {
                            numberInput.setValueState(sap.ui.core.ValueState.None);
                        }
                    }
                }

                if (bValid) {
                    if (oFormData.relatedParty.getText() === 'Yes') {
                        oFormData.relatedParty = true;
                    } else {
                        oFormData.relatedParty = false;
                    }

                    var oNewEntry = {
                        "DigressionVendorCodeVal": oFormData.validity,
                        "IsRelPartyVCode": oFormData.relatedParty,
                        "SpendType": oFormData.supplierSpendType,
                        "NatureOfActivity": oFormData.natureOfActivity,
                        "Sector": oFormData.sector,
                        "FunAndSubfun": oFormData.FunctionandSubfunction,
                        "PANCardNo": oFormData.panCardNumber,
                        "GSTIN": oFormData.gstinNumber,
                        "SFullName": oFormData.supplierFullName,
                        "STradeNameGST": oFormData.supplierTradeName,
                        "SAddress": oFormData.supplierAddress,
                        "SAddressGST": oFormData.supplierGstAddress,
                        "PriContactFName": oFormData.primaryFirstName,
                        "PriContactLName": oFormData.primaryLastName,
                        "PriContactEmail": oFormData.primaryEmail,
                        "PriContactMNumber": oFormData.primaryPhone
                    };
                    
                    oModel.setUseBatch(false);
                    var oView = this;
                    oModel.create("/supplierReqSrv", oNewEntry, {
                        method: "POST",
                        success: function (oData) {

                            MessageBox.success("Form submitted successfully." + oData.ID);
                            this.onUploadFile(oData.ID);
                            oView.clearFormFields();

                        }.bind(this), 
                        error: function () {
                            MessageBox.error("Error while submitting the Form.");
                        }
                    });
                }
                else {
                      MessageBox.error("Please fill All The Required fields.");
                }
            },


            onUploadFile: function (ReqID) {
                const postAttachments = (attachments, ReqID) => {
                    attachments.forEach((attachment) => {
                        var payLoad = {
                            Req_Supplier_ID: ReqID,
                            Attachment_ID: attachment.attachmentId,
                            fileName: attachment.fileName,
                            mediaType: attachment.fileType,
                            content: attachment.fileContent,
                            Doc_Type: attachment.Doc_Type
                        };

                        var oModel = this.getOwnerComponent().getModel();
                        oModel.setUseBatch(false);
                        oModel.create("/SReqattachmentsSrv", payLoad, {
                            method: "POST",
                            success: function (oData) {
                                MessageToast.show("Attachments uploaded successfully: " + oData.ID);
                            }.bind(this),
                            error: function () {
                                MessageToast.show("Error while Uploading the Attachments.");
                            }
                        });
                    });
                };

                var localModel = this.getView().getModel();
                var docFiles = localModel.getProperty("/documentFiles");
                var allAttachments = docFiles.pan.concat(docFiles.gst);
                postAttachments(allAttachments, ReqID);
            },

            onFileUpload: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var sValue = oFileUploader.getValue();
                var oFile = oFileUploader.oFileUpload.files[0];

                if (sValue) {
                    oFileUploader.setValueState(sap.ui.core.ValueState.None);
                }

                if (oFile) {
                    var sFileName = oFile.name;
                    var sFileType = sFileName.split('.').pop();
                    var oReader = new FileReader();
                    var that = this;
                    oReader.onload = function (e) {
                        var sFileUrl = e.target.result; 
                        var oModel = that.getView().getModel();
                        var oDocumentFiles = oModel.getProperty("/documentFiles") || { pan: [], gst: [], cin: [] }; 

                        var panCount = oDocumentFiles.pan.length + 1;
                        var gstCount = oDocumentFiles.gst.length + 1;
                        var cinCount = oDocumentFiles.cin.length + 1;
                        var uploaderId = oFileUploader.getId();
                        var documentType = "";
                        var attachmentId = ""; 
                        if (uploaderId.includes("fileUploaderPan")) {
                            documentType = "PAN";
                            attachmentId = panCount; 
                            oDocumentFiles.pan.push({
                                fileName: sFileName,
                                fileUrl: sFileUrl,
                                fileContent: sFileUrl,
                                fileType: sFileType,
                                Doc_Type: 'PAN',
                                attachmentId: attachmentId 
                            });
                        } else if (uploaderId.includes("fileUploaderGst")) {
                            documentType = "GST";
                            attachmentId = gstCount;  
                            oDocumentFiles.gst.push({
                                fileName: sFileName,
                                fileUrl: sFileUrl,
                                fileContent: sFileUrl,
                                fileType: sFileType,
                                Doc_Type: 'GST',
                                attachmentId: attachmentId 
                            });
                        } else if (uploaderId.includes("fileUploaderCin")) {
                            documentType = "CIN";
                            attachmentId = cinCount; 
                            oDocumentFiles.cin.push({
                                fileName: sFileName,
                                fileUrl: sFileUrl,
                                fileContent: sFileUrl,
                                fileType: sFileType,
                                Doc_Type: 'CIN',
                                attachmentId: attachmentId  
                            });
                        }
                        oModel.setProperty("/documentFiles", oDocumentFiles);
                        MessageToast.show(documentType + " file " + sFileName + " uploaded successfully.");
                        oModel.refresh(true);
                    };

                    oReader.readAsDataURL(oFile);
                }
            },

            formatAttachmentButtonText: function (aDocumentFiles, documentType) {
                aDocumentFiles = aDocumentFiles || [];
                return "View Attachments (" + aDocumentFiles.length + ")";
            },


            onOpenDialog: function (documentType) {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.sumo.supplieronboarding.view.fragment.uploadfile", this);
                    this.getView().addDependent(this._oDialog);
                }
                var oModel = this.getView().getModel();
                var aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType) || [];
                var oDialogModel = new sap.ui.model.json.JSONModel({ documentFiles: aDocumentFiles });
                this._oDialog.setModel(oDialogModel);
                this._oDialog.data("documentType", documentType);
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
                var oModel = this.getView().getModel();
                var aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType);
                var oFile = aDocumentFiles.find(file => file.fileName === sFileName);
                if (oFile && oFile.fileContent) {
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
                sap.m.MessageBox.confirm(`Are you sure you want to delete the file "${sFileName}"?`, {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            const oModel = this.getView().getModel();
                            const aDocumentFiles = oModel.getProperty("/documentFiles/" + documentType);
                            const updatedDocumentFiles = aDocumentFiles.filter(file => file.fileName !== sFileName);
                            oModel.setProperty("/documentFiles/" + documentType, updatedDocumentFiles);
                            MessageToast.show(`File "${sFileName}" deleted successfully.`);

                            if (documentType === "pan") {
                                this.byId("fileUploaderPan").setValue(""); 
                            } else if (documentType === "gst") {
                                this.byId("fileUploaderGst").setValue("");
                            }
            
                            this.onCloseDialog();
                        }
                    }.bind(this)
                });
            },

            _base64ToBlob: function (base64) {
                if (base64.startsWith("data:")) {
                    base64 = base64.split(",")[1];
                }
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
                    return null;
                }
            },

            handleLiveChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                if (sValue) {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },

            handleComboBoxChange: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedKey = oComboBox.getSelectedKey();

                if (sSelectedKey) {
                    oComboBox.setValueState(sap.ui.core.ValueState.None);
                }
            },
            handleDateChange: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getDateValue();
                if (sValue) {
                    oDatePicker.setValueState(sap.ui.core.ValueState.None);
                }
            },
            handleFileChange: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var sValue = oFileUploader.getValue();
                if (sValue) {
                    oFileUploader.setValueState(sap.ui.core.ValueState.None); 
                }
            },
            handleMultiComboBoxChange: function (oEvent) {
                var oMultiComboBox = oEvent.getSource();
                var aSelectedItems = oMultiComboBox.getSelectedItems();
                if (aSelectedItems.length > 0) {
                    oMultiComboBox.setValueState(sap.ui.core.ValueState.None);
                }
            },

            clearFormFields: function () {
                var oView = this.getView();
                oView.byId("datePicker").setDateValue(null);
                oView.byId("radioGroup").setSelectedButton(null);
                oView.byId("supplierSpendType").setSelectedKey("");
                oView.byId("NatureofActivity").setSelectedKey("");
                oView.byId("sectorComboBox").setSelectedKeys([]);
                oView.byId("childMultiComboBox").setSelectedKeys([]);
                oView.byId("panInput").setValue("");
                oView.byId("fileUploaderPan").setValue("");
                oView.byId("fileUploaderGst").setValue("");
                oView.byId("gstinInput").setValue("");
                oView.byId("SupplierNameInput").setValue("");
                oView.byId("SuppliertradeNameInput").setValue("");
                oView.byId("SupplierAddressInput").setValue("");
                oView.byId("SupplierAddressgstInput").setValue("");
                oView.byId("PrimaryFirstnameInput").setValue("");
                oView.byId("PrimaryLastnameInput").setValue("");
                oView.byId("emailInput").setValue("");
                oView.byId("numberInput").setValue("");
            },

            onReadSector: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/SectorSrv", {
                    success: function (oData) {
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
                var oModel = this.getOwnerComponent().getModel();
                var bValid = true; 

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
                var sFormData = JSON.stringify(oFormData);
                localStorage.setItem("formData", sFormData);

                // function validateField(oView, fieldId, value, errorMessage, bValid) {
                //     if (!value || value.trim() === "") {
                //         oView.byId(fieldId).setValueState(sap.ui.core.ValueState.Error).setValueStateText(errorMessage);
                //         return false;  
                //     } else {
                //         oView.byId(fieldId).setValueState(sap.ui.core.ValueState.None);
                //         return bValid;
                //     }
                // }

                // bValid = validateField(oView, "SupplierNameInput", oFormData.supplierFullName, "Supplier Full Name is required and cannot be only spaces.", bValid);
                // bValid = validateField(oView, "SuppliertradeNameInput", oFormData.supplierTradeName, "Supplier Trade Name is required and cannot be only spaces.", bValid);
                // bValid = validateField(oView, "SupplierAddressInput", oFormData.supplierAddress, "Supplier Address is required and cannot be only spaces.", bValid);
                // bValid = validateField(oView, "SupplierAddressgstInput", oFormData.supplierGstAddress, "Supplier GST Address is required and cannot be only spaces.", bValid);
                // bValid = validateField(oView, "PrimaryFirstnameInput", oFormData.primaryFirstName, "Primary First Name is required and cannot be only spaces.", bValid);
                // bValid = validateField(oView, "PrimaryLastnameInput", oFormData.primaryLastName, "Primary Last Name is required and cannot be only spaces.", bValid);


                // if (oFormData.panCardNumber.trim() === "") {
                //     oView.byId("panInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Number is required");
                //     bValid = false;
                // } else {
                //     var sPanCard = oFormData.panCardNumber.trim();
                //     // PAN format: 5 letters, 4 digits, 1 letter (e.g., AAAAA9999A)
                //     var panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                //     if (!panPattern.test(sPanCard)) {
                //         oView.byId("panInput").setValueState(sap.ui.core.ValueState.Error)
                //             .setValueStateText("Invalid PAN Card Number format. PAN should be in the format AAAAA9999A.");
                //         bValid = false;
                //     } else {
                //         oView.byId("panInput").setValueState(sap.ui.core.ValueState.None);
                //     }
                // }

                // if (oFormData.gstinNumber.trim() === "") {
                //     var gstinInput = oView.byId("gstinInput");
                //     if (gstinInput) {
                //         gstinInput.setValueState(sap.ui.core.ValueState.Error)
                //             .setValueStateText("GSTIN Number is required");
                //     }
                //     bValid = false;
                // } else {
                //     var sGstinNumber = oFormData.gstinNumber.trim();
                //     var gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[0-9]{1}$/;
                //     if (!gstinPattern.test(sGstinNumber)) {
                //         var gstinInput = oView.byId("gstinInput");
                //         if (gstinInput) {
                //             gstinInput.setValueState(sap.ui.core.ValueState.Error)
                //                 .setValueStateText("Invalid GSTIN Number format. It should be in the format 12ABCDE3456Z1Z5.");
                //         }
                //         bValid = false;
                //     } else {
                //         var gstinInput = oView.byId("gstinInput");
                //         if (gstinInput) {
                //             gstinInput.setValueState(sap.ui.core.ValueState.None);
                //         }
                //         var sGSTINPan = sGstinNumber.substring(2, 12);
                //         var sPanCard = oFormData.panCardNumber;

                //         if (sGSTINPan === sPanCard) {
                //             gstinInput.setValueState(sap.ui.core.ValueState.Success);
                //             gstinInput.setValueStateText(""); 
                //         } else {
                //             gstinInput.setValueState(sap.ui.core.ValueState.Error);
                //             gstinInput.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.");
                //             bValid = false;
                //         }
                //     }
                // }

                // if (oFormData.primaryEmail.trim() === "") {
                //     oView.byId("emailInput").setValueState(sap.ui.core.ValueState.Error)
                //         .setValueStateText("Primary Email is required");
                //     bValid = false;
                // } else {
                //     var sEmail = oFormData.primaryEmail.trim().replace(/\s+/g, "");
                //     var emailPattern = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;

                //     if (!emailPattern.test(sEmail)) {
                //         oView.byId("emailInput").setValueState(sap.ui.core.ValueState.Error)
                //             .setValueStateText("Invalid Primary Email format. Please enter a valid email.");
                //         bValid = false;
                //     } else {
                //         oView.byId("emailInput").setValueState(sap.ui.core.ValueState.None);
                //     }
                // }

                // if (oFormData.primaryPhone.trim() === "") {
                //     var numberInput = oView.byId("numberInput");
                //     if (numberInput) {
                //         numberInput.setValueState(sap.ui.core.ValueState.Error)
                //             .setValueStateText("Primary Phone Number is required");
                //     }
                //     bValid = false;
                // } else {
                //     var sPhoneNumber = oFormData.primaryPhone.trim();
                //     var phonePattern = /^[0-9]{10}$/; 
                //     if (!phonePattern.test(sPhoneNumber)) {
                //         var numberInput = oView.byId("numberInput");
                //         if (numberInput) {
                //             numberInput.setValueState(sap.ui.core.ValueState.Error)
                //                 .setValueStateText("Invalid Phone Number. It should be 10 digits.");
                //         }
                //         bValid = false;
                //     } else {
                //         var numberInput = oView.byId("numberInput");
                //         if (numberInput) {
                //             numberInput.setValueState(sap.ui.core.ValueState.None);
                //         }
                //     }
                // }

                // if (bValid) {
                //     if (oFormData.relatedParty.getText() === 'Yes') {
                //         oFormData.relatedParty = true;
                //     } else {
                //         oFormData.relatedParty = false;
                //     }
                // }
 
                //     var oNewEntry = {
                //         "DigressionVendorCodeVal": oFormData.validity,
                //         "IsRelPartyVCode": oFormData.relatedParty,
                //         "SpendType": oFormData.supplierSpendType,
                //         "NatureOfActivity": oFormData.natureOfActivity,
                //         "Sector": oFormData.sector,
                //         "FunAndSubfun": oFormData.FunctionandSubfunction,
                //         "PANCardNo": oFormData.panCardNumber,
                //         "GSTIN": oFormData.gstinNumber,
                //         "SFullName": oFormData.supplierFullName,
                //         "STradeNameGST": oFormData.supplierTradeName,
                //         "SAddress": oFormData.supplierAddress,
                //         "SAddressGST": oFormData.supplierGstAddress,
                //         "PriContactFName": oFormData.primaryFirstName,
                //         "PriContactLName": oFormData.primaryLastName,
                //         "PriContactEmail": oFormData.primaryEmail,
                //         "PriContactMNumber": oFormData.primaryPhone
                //     };

                MessageToast.show("Form data saved successfully in local storage.");

                  // Use the OData create method
                  oModel.setUseBatch(false);
                  var oView = this;
                  oModel.create("/SavingsupplierReqSrv", oNewEntry, {
                      method: "POST",
                      success: function (oData) {

                          MessageToast.show("Form Saved successfully." + oData.ID);
                          console.log(oData.ID);
                          this.onUploadFile(oData.ID);
                          console.log("---------->Upload");
                          oView.clearFormFields();

                      }.bind(this), 
                      error: function () {
                          MessageToast.show("Error while submitting the Form.");
                      }
                  });
            },

            onReadDepartments: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel(); 
                oModel.read("/departmentsSrv", {
                    success: function (oData) {
                        var jModel = new sap.ui.model.json.JSONModel(oData);
                        that.getView().setModel(jModel, "departmentsModel");
                        var oSelect = that.getView().byId("FunctionandSubfunctionComboBox");
                        var aItems = oSelect.getItems();

                        if (aItems && aItems.length > 0) {
                            oSelect.setSelectedItem(aItems[0]);
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

            onDepartmentChange: function (oEvent) {
                var that = this;
                var selectedItem = oEvent.getParameter("selectedItem");

                if (selectedItem) {
                    var selectedDepartment = selectedItem.getBindingContext("departmentsModel").getObject();
                    if (selectedDepartment.Functions && selectedDepartment.Functions.length > 0) {
                        var functionsModel = new sap.ui.model.json.JSONModel({ Functions: selectedDepartment.Functions });
                        that.getView().byId("childMultiComboBox").setModel(functionsModel, "functionsModel");
                    } else {
                        console.log("No functions available for the selected department.");
                    }

                };
            }
        });
    });