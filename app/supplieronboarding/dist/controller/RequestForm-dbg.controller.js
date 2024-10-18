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
    function (Controller, MessageToast, MessageBox,Icon, JSONModel, Fragment, Dialog, Button, Text) {
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
                var sValue = oInput.getValue().toUpperCase();  // Convert input to uppercase

                // Remove all non-alphanumeric characters
                sValue = sValue.replace(/[^A-Z0-9]/g, '');  // Keep only letters (A-Z) and numbers (0-9)

                // Update the input field with the cleaned-up value
                oInput.setValue(sValue);

                // Define a variable to hold the timeout reference
                if (this._panCardDebounceTimeout) {
                    clearTimeout(this._panCardDebounceTimeout); // Clear previous timeout
                }

                // Set a new timeout to validate after the user stops typing
                this._panCardDebounceTimeout = setTimeout(function () {
                    // Validate only if the length is exactly 10 characters
                    if (sValue.length === 10) {
                        var panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;  // PAN format: 5 letters, 4 numbers, 1 letter

                        if (panCardPattern.test(sValue)) {
                            oInput.setValueState("Success");
                            oInput.setValueStateText("");
                        } else {
                            oInput.setValueState("Error");
                            oInput.setValueStateText("Invalid PAN format. It should be 5 letters, 4 numbers, and 1 letter.");
                        }
                    } else {
                        // If input is not 10 characters long, show an error
                        oInput.setValueState("Error");
                        oInput.setValueStateText("PAN must be exactly 10 characters long.");
                    }
                }, 1000);  // Debounce delay of 1000 milliseconds
            },

            onGSTINChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue().toUpperCase();  // Convert input to uppercase

                // Remove all non-alphanumeric characters (only digits and uppercase letters)
                sValue = sValue.replace(/[^A-Z0-9]/g, '');  // Allow only A-Z and 0-9

                // Update the input field with the cleaned-up value
                oInput.setValue(sValue);

                var sPanCard = this.getView().getModel().getProperty("/panCardValue");  // Get the PAN from the model

                // Define a variable to hold the timeout reference
                if (this._gstinDebounceTimeout) {
                    clearTimeout(this._gstinDebounceTimeout);  // Clear previous timeout
                }

                // Set a new timeout to validate after the user stops typing
                this._gstinDebounceTimeout = setTimeout(function () {
                    // Validate only if the length is exactly 15 characters
                    if (sValue.length === 15) {
                        var gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;  // GSTIN format

                        if (gstinPattern.test(sValue)) {
                            // Extract PAN part from GSTIN (2nd to 11th characters)
                            var sGSTINPan = sValue.substring(2, 12);

                            // Check if the extracted PAN matches the entered PAN
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
                        // If input is not 15 characters long, show an error
                        oInput.setValueState("Error");
                        oInput.setValueStateText("GSTIN must be exactly 15 characters long.");
                    }
                }, 1000);  // Debounce delay of 1000 milliseconds
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

                // Disable spaces by removing them immediately after any input
                sEmail = sEmail.replace(/\s+/g, "");  // This removes all spaces from the input

                // Set the value back to the input field after removing spaces
                oInput.setValue(sEmail);

                // Clear any previous debounce timeout to reset the timer
                if (this._emailDebounceTimeout) {
                    clearTimeout(this._emailDebounceTimeout);
                }

                // Set a new debounce timeout to validate after 1000ms
                this._emailDebounceTimeout = setTimeout(function () {
                    // Updated regex pattern to validate email format
                    var emailPattern = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;

                    // Check if the email is not empty and matches the pattern
                    if (sEmail === "" || !emailPattern.test(sEmail)) {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("Invalid Email format. Please enter a valid Email.");
                    } else {
                        oInput.setValueState("Success");
                    }
                }, 1000);  // Debounce delay of 1000 milliseconds
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

                sValue = sValue.replace(/\D/g, '');

                if (sValue.length > 10) {
                    sValue = sValue.substring(0, 10);  // Limit the string to 10 digits
                }

                oInput.setValue(sValue);
                // Clear any previous timeout to reset the debounce timer
                if (this._numberDebounceTimeout) {
                    clearTimeout(this._numberDebounceTimeout);
                }

                // Set a new debounce timeout to validate after 1000ms
                this._numberDebounceTimeout = setTimeout(function () {
                    // This removes all non-numeric characters



                    // Validation logic
                    if (sValue.length === 10) {
                        oInput.setValueState("Success");
                    } else {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("Invalid Number. Please enter a valid Mobile Number.");
                    }
                }, 1000);  // Debounce delay of 1000 milliseconds
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
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                var bValid = true;  // Flag to track form validity
                var attachment = {
                    panattachment: oView.byId("fileUploaderPan").getValue(),
                    gstattachment: oView.byId("fileUploaderGst").getValue(),
                };
                // Collect form field values
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
                    primaryPhone: oView.byId("numberInput").getValue()
                };


                if (!oFormData.validity) {
                    oView.byId("datePicker").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Date is required");
                    bValid = false;
                } else {
                    oView.byId("datePicker").setValueState(sap.ui.core.ValueState.None);
                }

                if (oFormData.supplierSpendType.length === 0) {
                    oView.byId("supplierSpendType").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Supplier Spend Type is required");
                    bValid = false;
                } else {
                    oView.byId("supplierSpendType").setValueState(sap.ui.core.ValueState.None);
                }

                if (oFormData.natureOfActivity.length === 0) {
                    oView.byId("NatureofActivity").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Nature of Activity is required");
                    bValid = false;
                } else {
                    oView.byId("NatureofActivity").setValueState(sap.ui.core.ValueState.None);
                }

                if (oFormData.sector.length === 0) {
                    oView.byId("sectorComboBox").setValueState(sap.ui.core.ValueState.Error).setValueStateText("At least one sector is required.");
                    bValid = false;
                } else {
                    oView.byId("sectorComboBox").setValueState(sap.ui.core.ValueState.None);
                }

                if (oFormData.FunctionandSubfunction.length === 0) {
                    oView.byId("childMultiComboBox").setValueState(sap.ui.core.ValueState.Error).setValueStateText("At least one function/subfunction is required.");
                    bValid = false;
                } else {
                    oView.byId("childMultiComboBox").setValueState(sap.ui.core.ValueState.None);
                }

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

                if (!attachment.panattachment) {
                    oView.byId("fileUploaderPan").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Attachment is required");
                    bValid = false;
                } else {
                    oView.byId("fileUploaderPan").setValueState(sap.ui.core.ValueState.None);
                }

                if (!attachment.gstattachment) {
                    oView.byId("fileUploaderGst").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Attachment is required");
                    bValid = false;
                } else {
                    oView.byId("fileUploaderGst").setValueState(sap.ui.core.ValueState.None);
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

                    // GSTIN pattern: 15 characters (e.g., 22AAAAA1234A1Z5)
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
                            gstinInput.setValueState(sap.ui.core.ValueState.None);  // GSTIN format is valid, clear error state
                        }

                        // Extract PAN part from GSTIN (characters 2 to 11)
                        var sGSTINPan = sGstinNumber.substring(2, 12);
                        var sPanCard = oFormData.panCardNumber;

                        if (sGSTINPan === sPanCard) {
                            // GSTIN and PAN match
                            gstinInput.setValueState(sap.ui.core.ValueState.Success);
                            gstinInput.setValueStateText("");  // Clear any previous error messages
                        } else {
                            // PAN part of GSTIN does not match entered PAN
                            gstinInput.setValueState(sap.ui.core.ValueState.Error);
                            gstinInput.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.");
                            bValid = false;
                        }
                    }
                }


                if (!oFormData.supplierFullName || oFormData.supplierFullName.trim() === "") {
                    oView.byId("SupplierNameInput").setValueState(sap.ui.core.ValueState.Error);
                    oView.byId("SupplierNameInput").setValueStateText("Supplier Full Name is required and cannot be only spaces.");
                    bValid = false;
                } else {
                    oView.byId("SupplierNameInput").setValueState(sap.ui.core.ValueState.None);
                }

                if (!oFormData.supplierTradeName || oFormData.supplierTradeName.trim() === "") {
                    oView.byId("SuppliertradeNameInput").setValueState(sap.ui.core.ValueState.Error);
                    oView.byId("SuppliertradeNameInput").setValueStateText("Supplier Trade Name is required and cannot be only spaces.");
                    bValid = false;
                } else {
                    oView.byId("SuppliertradeNameInput").setValueState(sap.ui.core.ValueState.None);
                }

                if (!oFormData.supplierAddress || oFormData.supplierAddress.trim() === "") {
                    oView.byId("SupplierAddressInput").setValueState(sap.ui.core.ValueState.Error);
                    oView.byId("SupplierAddressInput").setValueStateText("Supplier Address is required and cannot be only spaces.");
                    bValid = false;
                } else {
                    oView.byId("SupplierAddressInput").setValueState(sap.ui.core.ValueState.None);
                }

                if (!oFormData.supplierGstAddress || oFormData.supplierGstAddress.trim() === "") {
                    oView.byId("SupplierAddressgstInput").setValueState(sap.ui.core.ValueState.Error);
                    oView.byId("SupplierAddressgstInput").setValueStateText("Supplier GST Address is required and cannot be only spaces.");
                    bValid = false;
                } else {
                    oView.byId("SupplierAddressgstInput").setValueState(sap.ui.core.ValueState.None);
                }

                if (!oFormData.primaryFirstName || oFormData.primaryFirstName.trim() === "") {
                    oView.byId("PrimaryFirstnameInput").setValueState(sap.ui.core.ValueState.Error);
                    oView.byId("PrimaryFirstnameInput").setValueStateText("Primary First Name is required and cannot be only spaces.");
                    bValid = false;
                } else {
                    oView.byId("PrimaryFirstnameInput").setValueState(sap.ui.core.ValueState.None);
                }

                if (!oFormData.primaryLastName || oFormData.primaryLastName.trim() === "") {
                    oView.byId("PrimaryLastnameInput").setValueState(sap.ui.core.ValueState.Error);
                    oView.byId("PrimaryLastnameInput").setValueStateText("Primary Last Name is required and cannot be only spaces.");
                    bValid = false;
                } else {
                    oView.byId("PrimaryLastnameInput").setValueState(sap.ui.core.ValueState.None);
                }

                if (!oFormData.primaryEmail || oFormData.primaryEmail.trim() === "") {
                    oView.byId("emailInput").setValueState(sap.ui.core.ValueState.Error)
                        .setValueStateText("Primary Email is required");
                    bValid = false;
                } else {
                    // Remove spaces and validate email format
                    var sEmail = oFormData.primaryEmail.trim().replace(/\s+/g, "");  // Remove spaces

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

                    // Phone number validation pattern (allowing only numbers and optional formatting like dashes)
                    var phonePattern = /^[0-9]{10}$/;  // Example: 10-digit phone number

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

                if (!bValid) {
                    return;  // Prevent form submission
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
                    console.log("DATE");
                    console.log(oFormData.validity);

                    // var oNewEntry = {
                    //     "DigressionVendorCodeVal": "2025-09-30",
                    //     "IsRelPartyVCode": true,
                    //     "SpendType": "Indirect",
                    //     "NatureOfActivity": "Material",
                    //     "Sector": ["IT", "Manufacturing"],
                    //     "FunAndSubfun": ["Finance", "HR"],
                    //     "PANCardNo": "ABCDE1234F",
                    //     "GSTIN": "27ABCDE1234F1Z5",
                    //     "SFullName": "ABC Corp Pvt. Ltd.",
                    //     "STradeNameGST": "ABC Trade",
                    //     "SAddress": "123, Example Street, City, State",
                    //     "SAddressGST": "123, Example Street, City, State",
                    //     "PriContactFName": "Sumit",
                    //     "PriContactLName": "Doe",
                    //     "PriContactEmail": "john.doe@example.com",
                    //     "PriContactMNumber": "1234567890"
                    // }

                    // Use the OData create method
                    oModel.setUseBatch(false);
                    var oView = this;
                    oModel.create("/supplierReqSrv", oNewEntry, {
                        method: "POST",
                        success: function (oData) {

                            MessageToast.show("Form submitted successfully." + oData.ID);
                            console.log(oData.ID);
                            this.onUploadFile(oData.ID);
                            console.log("---------->Upload");
                            oView.clearFormFields();

                        }.bind(this),  // Ensure 'this' refers to the controller instance
                        error: function () {
                            MessageToast.show("Error while submitting the Form.");
                        }
                    });
                }
                else {
                    sap.m.MessageToast.show("Please fill All The Required fields.");
                }
            },


            onUploadFile: function (ReqID) {

                // Use arrow function for postAttachments
                const postAttachments = (attachments, ReqID) => {
                    attachments.forEach((attachment) => {
                        console.log("Control reached!!!");
                        var payLoad = {
                            Req_Supplier_ID: ReqID,
                            Attachment_ID: attachment.attachmentId,
                            fileName: attachment.fileName,
                            mediaType: attachment.fileType,
                            content: attachment.fileContent,
                            Doc_Type: attachment.Doc_Type
                            // Assuming imageType refers to fileType
                        };
                        console.log(payLoad);

                        var oModel = this.getOwnerComponent().getModel();
                        oModel.setUseBatch(false);
                        oModel.create("/SReqattachmentsSrv", payLoad, {
                            method: "POST",
                            success: function (oData) {
                                MessageToast.show("Attachments uploaded successfully: " + oData.ID);
                            }.bind(this),  // Ensure 'this' refers to the controller instance
                            error: function () {
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
                var sValue = oFileUploader.getValue();
                var oFile = oFileUploader.oFileUpload.files[0];  // Get the uploaded file

                if (sValue) {
                    oFileUploader.setValueState(sap.ui.core.ValueState.None); // Reset ValueState if a file is uploaded
                }

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
                            attachmentId = panCount;  // Simple counter for PAN
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
                            attachmentId = gstCount;  // Simple counter for GST
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
                            attachmentId = cinCount;  // Simple counter for CIN
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

            handleLiveChange: function (oEvent) {
                var oInput = oEvent.getSource(); // Get the input field that triggered the event
                var sValue = oInput.getValue(); // Get the current value of the input field

                // If the input field has a value, reset its ValueState to None
                if (sValue) {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },

            handleComboBoxChange: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedKey = oComboBox.getSelectedKey(); // Get the selected key

                if (sSelectedKey) {
                    oComboBox.setValueState(sap.ui.core.ValueState.None); // Reset ValueState if a value is selected
                }
            },
            handleDateChange: function (oEvent) {
                var oDatePicker = oEvent.getSource();
                var sValue = oDatePicker.getDateValue(); // Get the selected date value

                if (sValue) {
                    oDatePicker.setValueState(sap.ui.core.ValueState.None); // Reset ValueState if a valid date is selected
                }
            },
            handleFileChange: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var sValue = oFileUploader.getValue(); // Get the uploaded file's value

                if (sValue) {
                    oFileUploader.setValueState(sap.ui.core.ValueState.None); // Reset ValueState if a file is uploaded
                }
            },
            handleMultiComboBoxChange: function (oEvent) {
                var oMultiComboBox = oEvent.getSource();
                var aSelectedItems = oMultiComboBox.getSelectedItems(); // Get selected items

                // Check if there are any selected items
                if (aSelectedItems.length > 0) {
                    oMultiComboBox.setValueState(sap.ui.core.ValueState.None); // Reset ValueState if items are selected
                }
            },

            clearFormFields: function () {
                var oView = this.getView();

                // Clear the fields
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
            },
            onFormSave: function () {
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                var bValid = true;  // Flag to track form validity
              
                // Collect form field values
                // var oFormData = {
                //     validity: oView.byId("datePicker").getValue(),
                //     relatedParty: oView.byId("radioGroup").getSelectedButton(),
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


               

                // if (bValid) {
                //     if (oFormData.relatedParty.getText() === 'Yes') {
                //         oFormData.relatedParty = true;
                //     } else {
                //         oFormData.relatedParty = false;
                //     }

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
                        "PriContactMNumber": "1234567890",
                    }

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

                        }.bind(this),  // Ensure 'this' refers to the controller instance
                        error: function () {
                            MessageToast.show("Error while submitting the Form.");
                        }
                    });
                
               
            },

        });
    });