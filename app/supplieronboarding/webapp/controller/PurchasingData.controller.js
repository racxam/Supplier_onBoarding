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
    function (Controller, MessageToast, MessageBox, Icon, JSONModel, Fragment, Dialog, Button, Text) {
        "use strict";

        return Controller.extend("com.sumo.supplieronboarding.controller.PurchasingData", {
            onInit: function () {
            },
            onPDFormsubmit: function () {
                var oView = this.getView();
                var bValid = true;
                
                var oNewGroupInput = oView.byId("Newgroup");
                var oNewparentInput = oView.byId("Newparent");
                var oCorvencodeInput = oView.byId("correspondingvendorcode");
                var oFileUploaderContainer = this.byId("SupplierDueAttachment");
                var oRemarksField = this.byId("RemarksDueDiligence");
                var SacDocument = this.byId("SanctionDocument");
                var DomSupplier = this.byId("DomesticSupplier");
                var ImpSupplier = this.byId("ImportSupplier");
              
                var oPDFormData = {
                    Vendorcodeverify: oView.byId("Vendorcodeverify").getSelectedKey(),
                    Selectgroupsupplier: oView.byId("Selectgroupsupplier").getSelectedKey(),
                    Groupnotavailable: oView.byId("Groupnotavailable").getSelectedButton(),
                    Newgroup: oView.byId("Newgroup").getValue(),
                    Selectparentsupplier: oView.byId("Selectparentsupplier").getSelectedKey(),
                    Parentnotavailable: oView.byId("Parentnotavailable").getSelectedButton(),
                    Newparent: oView.byId("Newparent").getValue(),
                    AccountGroup: oView.byId("AccountGroup").getSelectedKey(),
                    SearchTerm: oView.byId("SearchTerm").getValue(),
                    SupplierDue: oView.byId("SupplierDue").getSelectedButton(),
                    SupplierDueAttachment: oView.byId("SupplierDueAttachment").getValue(),
                    RemarksDueDiligence: oView.byId("RemarksDueDiligence").getValue(),
                    SanctionDocument: oView.byId("SanctionDocument").getValue(),
                    PurchasingOrg: oView.byId("PurchasingOrg").getSelectedKey(),
                    PurchaseCurrCode: oView.byId("PurchaseCurrCode").getSelectedKey(),
                    vendorcoderegistered: oView.byId("vendorcoderegistered").getSelectedButton(),
                    correspondingvendorcode: oView.byId("correspondingvendorcode").getValue(),
                    DomesticSupplier: oView.byId("DomesticSupplier").getSelectedKey(),
                    ImportSupplier: oView.byId("ImportSupplier").getSelectedKey()
                };

                var bValid = true;
                
                function validateField(oView, fieldId, value, errorMessage, bValid) {
                    if (!value || (typeof value === 'string' && value.trim() === "") || value.length === 0) {
                        oView.byId(fieldId).setValueState(sap.ui.core.ValueState.Error).setValueStateText(errorMessage);
                        return false;
                    } else {
                        oView.byId(fieldId).setValueState(sap.ui.core.ValueState.None);
                        return bValid;
                    }
                }
                if (oNewGroupInput.getVisible()) {
                    if (!oPDFormData.Newgroup || oPDFormData.Newgroup.trim() === "") {
                        oNewGroupInput.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter a new Group to be created");
                        bValid = false;
                    } else {
                        oNewGroupInput.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                if (oNewparentInput.getVisible()) {
                    if (!oPDFormData.Newparent || oPDFormData.Newparent.trim() === "") {
                        oNewparentInput.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter a new Group to be created");
                        bValid = false;
                    } else {
                        oNewparentInput.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                if (oCorvencodeInput.getVisible()) {
                    if (!oPDFormData.correspondingvendorcode || oPDFormData.correspondingvendorcode.trim() === "") {
                        oCorvencodeInput.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter the corresponding vendor code.");
                        bValid = false;
                    } else {
                        oCorvencodeInput.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                if (oFileUploaderContainer.getVisible()) {
                    if (!oPDFormData.SupplierDueAttachment || oPDFormData.SupplierDueAttachment.trim() === "") {
                        oFileUploaderContainer.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Attach Supporting Documents for Due Diligence.");
                        bValid = false;
                    } else {
                        oFileUploaderContainer.setValueState(sap.ui.core.ValueState.None);
                    }
                } else if (oRemarksField.getVisible()) {
                    if (!oPDFormData.RemarksDueDiligence || oPDFormData.RemarksDueDiligence.trim() === "") {
                        oRemarksField.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Remarks for Due Diligence are required.");
                        bValid = false;
                    } else {
                        oRemarksField.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                if (SacDocument.getVisible()) {
                    if (!oPDFormData.SanctionDocument || oPDFormData.SanctionDocument .trim() === "") {
                        SacDocument.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Attach Supporting Documents for Due Diligence.");
                        bValid = false;
                    } else {
                        SacDocument.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                if (DomSupplier.getVisible()) {
                    if (!oPDFormData.DomesticSupplier || oPDFormData.DomesticSupplier .trim() === "") {
                        DomSupplier.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Attach Supporting Documents for Due Diligence.");
                        bValid = false;
                    } else {
                        DomSupplier.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                if (ImpSupplier.getVisible()) {
                    if (!oPDFormData.ImportSupplier || oPDFormData.ImportSupplier .trim() === "") {
                        ImpSupplier.setValueState(sap.ui.core.ValueState.Error)
                            .setValueStateText("Attach Supporting Documents for Due Diligence.");
                        bValid = false;
                    } else {
                        ImpSupplier.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                
                // Perform validations for each field
                bValid = validateField(oView, "Vendorcodeverify", oPDFormData.Vendorcodeverify, "Please enter the correct Vendor Code", bValid);
                bValid = validateField(oView, "Selectgroupsupplier", oPDFormData.Selectgroupsupplier, "Group Supplier is required", bValid);
                bValid = validateField(oView, "Groupnotavailable", oPDFormData.Groupnotavailable, "Select the button", bValid);
                //bValid = validateField(oView, "Newgroup", oPDFormData.Newgroup, "Please enter a new Group to be created", bValid);
                bValid = validateField(oView, "Selectparentsupplier", oPDFormData.Selectparentsupplier, "Parent Supplier is required", bValid);
                bValid = validateField(oView, "Parentnotavailable", oPDFormData.Parentnotavailable, "Select the button", bValid);
                //bValid = validateField(oView, "Newparent", oPDFormData.Newparent, "Enter a new Parent to be created. Spaces are not allowed.", bValid);
                bValid = validateField(oView, "AccountGroup", oPDFormData.AccountGroup, "Account Group is required", bValid);
                bValid = validateField(oView, "SearchTerm", oPDFormData.SearchTerm, "Search Term is required. Spaces are not allowed.", bValid);
                bValid = validateField(oView, "SupplierDue", oPDFormData.SupplierDue, "Supplier Due Diligence check is required", bValid);
               // bValid = validateField(oView, "SupplierDueAttachment", oPDFormData.SupplierDueAttachment, "Attach Supporting Documents for Due Diligence", bValid);
               // bValid = validateField(oView, "RemarksDueDiligence", oPDFormData.RemarksDueDiligence, "Remarks for Due Diligence are required. Spaces are not allowed.", bValid);
                bValid = validateField(oView, "SanctionDocument", oPDFormData.SanctionDocument, "International Sanction Document (PDF) is required", bValid);
                bValid = validateField(oView, "PurchasingOrg", oPDFormData.PurchasingOrg, "Select the Purchasing Org.", bValid);
                bValid = validateField(oView, "PurchaseCurrCode", oPDFormData.PurchaseCurrCode, "Select the Purchase Order Currency Code", bValid);
                bValid = validateField(oView, "vendorcoderegistered", oPDFormData.vendorcoderegistered, "Select the button", bValid);
               // bValid = validateField(oView, "correspondingvendorcode", oPDFormData.correspondingvendorcode, "Please enter the corresponding vendor code. Spaces are not allowed.", bValid);
                bValid = validateField(oView, "DomesticSupplier", oPDFormData.DomesticSupplier, "Schema Group for Domestic Supplier is required", bValid);
                bValid = validateField(oView, "ImportSupplier", oPDFormData.ImportSupplier, "Schema Group for Import Supplier is required", bValid);

                if (bValid) {
                    MessageBox.success("Form submitted successfully!");
                    console.log(oPDFormData);
                } else {
                    MessageBox.error("Please fill all the required fields.");
                }
            },
            handleComboBoxChange: function (oEvent) {
                var oComboBox = oEvent.getSource();
                var sSelectedKey = oComboBox.getSelectedKey();

                if (sSelectedKey) {
                    oComboBox.setValueState(sap.ui.core.ValueState.None);
                }
            },
            handleLiveChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                if (sValue) {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },
            handleFileChange: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var sValue = oFileUploader.getValue();
                if (sValue) {
                    oFileUploader.setValueState(sap.ui.core.ValueState.None);
                }
            },
            onSelectNewgroup: function (oEvent) {
            var oRadioButtonGroup = oEvent.getSource();
            var oSelectedButton = oRadioButtonGroup.getSelectedButton();
            var selectedKey = oSelectedButton.mProperties.text;
                var oInput = this.byId("Newgroup");   
                if (selectedKey === "Yes") {
                    oInput.setEditable(true);
                    oInput.setVisible(true);
                    this.autoSelectYes("Yes");
                } else if(selectedKey === "No") {
                    oInput.setEditable(false);
                    oInput.setVisible(false);
                }
            },
            autoSelectYes: function (isGroupNotAvailable) {
                var oParentRadioButtonGroup = this.byId("Parentnotavailable");
                if (isGroupNotAvailable === "Yes") {
                    oParentRadioButtonGroup.setSelectedIndex(0);
                    var oParentInput = this.byId("Newparent");
                    oParentInput.setEditable(true);
                    oParentInput.setVisible(true); 
                }
            },
            onSelectNewparent: function (oEvent) {
                var oRadioButtonGroup = oEvent.getSource();
                var oSelectedButton = oRadioButtonGroup.getSelectedButton();
                var selectedKey = oSelectedButton.mProperties.text;
                    var oParentInput = this.byId("Newparent");   
                    if (selectedKey === "Yes") {
                        oParentInput.setEditable(true);
                        oParentInput.setVisible(true);
                    } else if(selectedKey === "No") {
                        oParentInput.setEditable(false);
                        oParentInput.setVisible(false);
                    }
                },
            onSelectSupplierAssessment: function (oEvent) {
                var oRadioButtonGroup = oEvent.getSource();
                var oSelectedButton = oRadioButtonGroup.getSelectedButton();
                var selectedKey = oSelectedButton.mProperties.text;
                    var oInput1 = this.byId("SupplierAssessmentForm");   
                    if (selectedKey === "Yes") {
                        oInput1.setVisible(true);
                    } else if(selectedKey === "No") {
                        oInput1.setVisible(false);
                    }
                },
                onSelectcorrespond: function (oEvent) {
                    var oRadioButtonGroup = oEvent.getSource();
                    var oSelectedButton = oRadioButtonGroup.getSelectedButton();
                    var selectedKey = oSelectedButton.mProperties.text;
                        var oInput2 = this.byId("correspondingvendorcode");   
                        if (selectedKey === "Yes") {
                            oInput2.setEditable(true);
                            oInput2.setVisible(true);
                        } else if(selectedKey === "No") {
                            oInput2.setEditable(false);
                            oInput2.setVisible(false);
                        }
                    },
                    onSelectChange: function(oEvent) {
                    var oRadioButtonGroup = oEvent.getSource();
                    var oSelectedButton = oRadioButtonGroup.getSelectedButton();
                    var selectedKey = oSelectedButton.mProperties.text;
                        var oFileUploaderContainer = this.byId("SupplierDueAttachment");
                        var oRemarksField = this.byId("RemarksDueDiligence");
                    
                        if (selectedKey === "Done") {
                            oFileUploaderContainer.setVisible(true);
                            oRemarksField.setVisible(false);
                            oRemarksField.setEditable(false);
                        } else if (selectedKey === "Not Done") {
                            oFileUploaderContainer.setVisible(false);
                            oRemarksField.setVisible(true);
                            oRemarksField.setEditable(true);
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
                            if (sValue) {
                                oInput.setValueState("Success");
                            } else {
                                oInput.setValueState("Error");
                                oInput.setValueStateText("Invalid Number. Please enter a valid Vender Code.");
                            }
                        }, 1000);
                    },
                    onSelectionSupplierType: function() {
                        var oComboBox = this.byId("SupplierType1");
                        var sSelectedKey = oComboBox.getSelectedKey();
                        var oInput5=this.byId("SanctionDocument");
                        var oInput6=this.byId("ImportSupplier");
                        var oInput7=this.byId("DomesticSupplier");
                        
                        if (sSelectedKey === "Import") {
                            oInput5.setVisible(true);
                            oInput6.setVisible(true);
                            oInput7.setVisible(false)
                        } else if (sSelectedKey === "LocalGST") {
                            oInput7.setVisible(true);
                            oInput5.setVisible(false);
                            oInput6.setVisible(false);
                        }
                    },
           
            onPDFormSave: function () {

            },

        });
    });