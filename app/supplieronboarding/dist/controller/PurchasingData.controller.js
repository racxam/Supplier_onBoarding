sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/m/MessageBox","sap/ui/core/Icon","sap/m/Link","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/m/Dialog","sap/m/Button","sap/m/Text"],function(e,t,r,a,i,u,o,s,l){"use strict";return e.extend("com.sumo.supplieronboarding.controller.PurchasingData",{onInit:function(){},onPDFormsubmit:function(){var e=this.getView();var t=true;var a=e.byId("Newgroup");var i=e.byId("Newparent");var u=e.byId("correspondingvendorcode");var o=this.byId("SupplierDueAttachment");var s=this.byId("RemarksDueDiligence");var l=this.byId("SanctionDocument");var n=this.byId("DomesticSupplier");var c=this.byId("ImportSupplier");var p={Vendorcodeverify:e.byId("Vendorcodeverify").getSelectedKey(),Selectgroupsupplier:e.byId("Selectgroupsupplier").getSelectedKey(),Groupnotavailable:e.byId("Groupnotavailable").getSelectedButton(),Newgroup:e.byId("Newgroup").getValue(),Selectparentsupplier:e.byId("Selectparentsupplier").getSelectedKey(),Parentnotavailable:e.byId("Parentnotavailable").getSelectedButton(),Newparent:e.byId("Newparent").getValue(),AccountGroup:e.byId("AccountGroup").getSelectedKey(),SearchTerm:e.byId("SearchTerm").getValue(),SupplierDue:e.byId("SupplierDue").getSelectedButton(),SupplierDueAttachment:e.byId("SupplierDueAttachment").getValue(),RemarksDueDiligence:e.byId("RemarksDueDiligence").getValue(),SanctionDocument:e.byId("SanctionDocument").getValue(),PurchasingOrg:e.byId("PurchasingOrg").getSelectedKey(),PurchaseCurrCode:e.byId("PurchaseCurrCode").getSelectedKey(),vendorcoderegistered:e.byId("vendorcoderegistered").getSelectedButton(),correspondingvendorcode:e.byId("correspondingvendorcode").getValue(),DomesticSupplier:e.byId("DomesticSupplier").getSelectedKey(),ImportSupplier:e.byId("ImportSupplier").getSelectedKey()};var t=true;function S(e,t,r,a,i){if(!r||typeof r==="string"&&r.trim()===""||r.length===0){e.byId(t).setValueState(sap.ui.core.ValueState.Error).setValueStateText(a);return false}else{e.byId(t).setValueState(sap.ui.core.ValueState.None);return i}}if(a.getVisible()){if(!p.Newgroup||p.Newgroup.trim()===""){a.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter a new Group to be created");t=false}else{a.setValueState(sap.ui.core.ValueState.None)}}if(i.getVisible()){if(!p.Newparent||p.Newparent.trim()===""){i.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter a new Group to be created");t=false}else{i.setValueState(sap.ui.core.ValueState.None)}}if(u.getVisible()){if(!p.correspondingvendorcode||p.correspondingvendorcode.trim()===""){u.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter the corresponding vendor code.");t=false}else{u.setValueState(sap.ui.core.ValueState.None)}}if(o.getVisible()){if(!p.SupplierDueAttachment||p.SupplierDueAttachment.trim()===""){o.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Attach Supporting Documents for Due Diligence.");t=false}else{o.setValueState(sap.ui.core.ValueState.None)}}else if(s.getVisible()){if(!p.RemarksDueDiligence||p.RemarksDueDiligence.trim()===""){s.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Remarks for Due Diligence are required.");t=false}else{s.setValueState(sap.ui.core.ValueState.None)}}if(l.getVisible()){if(!p.SanctionDocument||p.SanctionDocument.trim()===""){l.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Attach Supporting Documents for Due Diligence.");t=false}else{l.setValueState(sap.ui.core.ValueState.None)}}if(n.getVisible()){if(!p.DomesticSupplier||p.DomesticSupplier.trim()===""){n.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Attach Supporting Documents for Due Diligence.");t=false}else{n.setValueState(sap.ui.core.ValueState.None)}}if(c.getVisible()){if(!p.ImportSupplier||p.ImportSupplier.trim()===""){c.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Attach Supporting Documents for Due Diligence.");t=false}else{c.setValueState(sap.ui.core.ValueState.None)}}t=S(e,"Vendorcodeverify",p.Vendorcodeverify,"Please enter the correct Vendor Code",t);t=S(e,"Selectgroupsupplier",p.Selectgroupsupplier,"Group Supplier is required",t);t=S(e,"Groupnotavailable",p.Groupnotavailable,"Select the button",t);t=S(e,"Selectparentsupplier",p.Selectparentsupplier,"Parent Supplier is required",t);t=S(e,"Parentnotavailable",p.Parentnotavailable,"Select the button",t);t=S(e,"AccountGroup",p.AccountGroup,"Account Group is required",t);t=S(e,"SearchTerm",p.SearchTerm,"Search Term is required. Spaces are not allowed.",t);t=S(e,"SupplierDue",p.SupplierDue,"Supplier Due Diligence check is required",t);t=S(e,"SanctionDocument",p.SanctionDocument,"International Sanction Document (PDF) is required",t);t=S(e,"PurchasingOrg",p.PurchasingOrg,"Select the Purchasing Org.",t);t=S(e,"PurchaseCurrCode",p.PurchaseCurrCode,"Select the Purchase Order Currency Code",t);t=S(e,"vendorcoderegistered",p.vendorcoderegistered,"Select the button",t);t=S(e,"DomesticSupplier",p.DomesticSupplier,"Schema Group for Domestic Supplier is required",t);t=S(e,"ImportSupplier",p.ImportSupplier,"Schema Group for Import Supplier is required",t);if(t){r.success("Form submitted successfully!");console.log(p)}else{r.error("Please fill all the required fields.")}},handleComboBoxChange:function(e){var t=e.getSource();var r=t.getSelectedKey();if(r){t.setValueState(sap.ui.core.ValueState.None)}},handleLiveChange:function(e){var t=e.getSource();var r=t.getValue();if(r){t.setValueState(sap.ui.core.ValueState.None)}},handleFileChange:function(e){var t=e.getSource();var r=t.getValue();if(r){t.setValueState(sap.ui.core.ValueState.None)}},onSelectNewgroup:function(e){var t=e.getSource();var r=t.getSelectedButton();var a=r.mProperties.text;var i=this.byId("Newgroup");if(a==="Yes"){i.setEditable(true);i.setVisible(true);this.autoSelectYes("Yes")}else if(a==="No"){i.setEditable(false);i.setVisible(false)}},autoSelectYes:function(e){var t=this.byId("Parentnotavailable");if(e==="Yes"){t.setSelectedIndex(0);var r=this.byId("Newparent");r.setEditable(true);r.setVisible(true)}},onSelectNewparent:function(e){var t=e.getSource();var r=t.getSelectedButton();var a=r.mProperties.text;var i=this.byId("Newparent");if(a==="Yes"){i.setEditable(true);i.setVisible(true)}else if(a==="No"){i.setEditable(false);i.setVisible(false)}},onSelectSupplierAssessment:function(e){var t=e.getSource();var r=t.getSelectedButton();var a=r.mProperties.text;var i=this.byId("SupplierAssessmentForm");if(a==="Yes"){i.setVisible(true)}else if(a==="No"){i.setVisible(false)}},onSelectcorrespond:function(e){var t=e.getSource();var r=t.getSelectedButton();var a=r.mProperties.text;var i=this.byId("correspondingvendorcode");if(a==="Yes"){i.setEditable(true);i.setVisible(true)}else if(a==="No"){i.setEditable(false);i.setVisible(false)}},onSelectChange:function(e){var t=e.getSource();var r=t.getSelectedButton();var a=r.mProperties.text;var i=this.byId("SupplierDueAttachment");var u=this.byId("RemarksDueDiligence");if(a==="Done"){i.setVisible(true);u.setVisible(false);u.setEditable(false)}else if(a==="Not Done"){i.setVisible(false);u.setVisible(true);u.setEditable(true)}},onNumberChange:function(e){var t=e.getSource();var r=t.getValue();r=r.replace(/\D/g,"");if(r.length>10){r=r.substring(0,10)}t.setValue(r);if(this._numberDebounceTimeout){clearTimeout(this._numberDebounceTimeout)}this._numberDebounceTimeout=setTimeout(function(){if(r){t.setValueState("Success")}else{t.setValueState("Error");t.setValueStateText("Invalid Number. Please enter a valid Vender Code.")}},1e3)},onSelectionSupplierType:function(){var e=this.byId("SupplierType1");var t=e.getSelectedKey();var r=this.byId("SanctionDocument");var a=this.byId("ImportSupplier");var i=this.byId("DomesticSupplier");if(t==="Import"){r.setVisible(true);a.setVisible(true);i.setVisible(false)}else if(t==="LocalGST"){i.setVisible(true);r.setVisible(false);a.setVisible(false)}},onPDFormSave:function(){}})});
//# sourceMappingURL=PurchasingData.controller.js.map