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
                //var GSInfoView = oView.byId("bbt5");

                // Collect form data
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
                    SupplierDue: oView.byId("SupplierDue").getSelectedKey(),
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

                var bValid = true; // Initialize form validity flag
            
            // Utility function to validate fields
            function validateField(oView, fieldId, value, errorMessage, bValid) {
                if (!value || (typeof value === 'string' && value.trim() === "") || value.length === 0) {
                    oView.byId(fieldId).setValueState(sap.ui.core.ValueState.Error).setValueStateText(errorMessage);
                    return false;
                } else {
                    oView.byId(fieldId).setValueState(sap.ui.core.ValueState.None);
                    return bValid;
                }
            }

            // Perform validations for each field
            bValid = validateField(oView, "Vendorcodeverify", oPDFormData.Vendorcodeverify, "Please enter the correct Vendor Code", bValid);
            bValid = validateField(oView, "Selectgroupsupplier", oPDFormData.Selectgroupsupplier, "Group Supplier is required", bValid);
            bValid = validateField(oView, "Groupnotavailable", oPDFormData.Groupnotavailable, "Select the button", bValid);
            bValid = validateField(oView, "Newgroup", oPDFormData.Newgroup, "Please enter a new Group to be created", bValid);
            bValid = validateField(oView, "Selectparentsupplier", oPDFormData.Selectparentsupplier, "Parent Supplier is required", bValid);
            bValid = validateField(oView, "Parentnotavailable", oPDFormData.Parentnotavailable, "Select the button", bValid);
            bValid = validateField(oView, "Newparent", oPDFormData.Newparent, "Enter a new Parent to be created. Spaces are not allowed.", bValid);
            bValid = validateField(oView, "AccountGroup", oPDFormData.AccountGroup, "Account Group is required", bValid);
            bValid = validateField(oView, "SearchTerm", oPDFormData.SearchTerm, "Search Term is required. Spaces are not allowed.", bValid);
            bValid = validateField(oView, "SupplierDue", oPDFormData.SupplierDue, "Supplier Due Diligence check is required", bValid);
            bValid = validateField(oView, "SupplierDueAttachment", oPDFormData.SupplierDueAttachment, "Attach Supporting Documents for Due Diligence", bValid);
            bValid = validateField(oView, "RemarksDueDiligence", oPDFormData.RemarksDueDiligence, "Remarks for Due Diligence are required. Spaces are not allowed.", bValid);
            bValid = validateField(oView, "SanctionDocument", oPDFormData.SanctionDocument, "International Sanction Document (PDF) is required", bValid);
            bValid = validateField(oView, "PurchasingOrg", oPDFormData.PurchasingOrg, "Select the Purchasing Org.", bValid);
            bValid = validateField(oView, "PurchaseCurrCode", oPDFormData.PurchaseCurrCode, "Select the Purchase Order Currency Code", bValid);
            bValid = validateField(oView, "vendorcoderegistered", oPDFormData.vendorcoderegistered, "Select the button", bValid);
            bValid = validateField(oView, "correspondingvendorcode", oPDFormData.correspondingvendorcode, "Please enter the corresponding vendor code. Spaces are not allowed.", bValid);
            bValid = validateField(oView, "DomesticSupplier", oPDFormData.DomesticSupplier, "Schema Group for Domestic Supplier is required", bValid);
            bValid = validateField(oView, "ImportSupplier", oPDFormData.ImportSupplier, "Schema Group for Import Supplier is required", bValid);

            // Check if all fields are valid
            if (bValid) {
                MessageBox.success("Form submitted successfully!");
                console.log(oPDFormData);
            } else {
                MessageBox.error("Please fill in all required fields.");
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




          
            onPDFormSave: function () {
                
            },

        });
    });