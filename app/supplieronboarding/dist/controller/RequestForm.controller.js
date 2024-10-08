sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/m/MessageBox","sap/ui/core/Icon","sap/m/Link","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/m/Dialog","sap/m/Button","sap/m/Text"],function(e,t,a,r,o,l,s,i){"use strict";return e.extend("com.sumo.supplieronboarding.controller.RequestForm",{onInit:function(){var e=new sap.ui.model.json.JSONModel({documentfiles:[]});this.getView().setModel(e);this.onReadSupplierSpendType();this.onReadNatureofActivity();this.onReadSector();this.onReadDepartments();var t=new Date;var a=new Date;a.setFullYear(t.getFullYear()+4);var r=this.byId("datePicker");r.setMinDate(t);r.setMaxDate(a);var e=new sap.ui.model.json.JSONModel({panCardValue:"",gstinValue:"",emailValue:"",numberValue:"",pan:[],gst:[]});this.getView().setModel(e)},onPanCardChange:function(e){var t=e.getSource();var a=t.getValue();var r=/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;if(r.test(a)){t.setValueState("Success")}else{t.setValueState("Error");t.setValueStateText("Invalid PAN format. Please enter a valid PAN.")}},onGSTINChange:function(e){var t=e.getSource();var a=t.getValue();var r=/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;var o=this.getView().getModel().getProperty("/panCardValue");if(r.test(a)){var l=a.substring(2,12);if(l===o){t.setValueState("Success")}else{t.setValueState("Error");t.setValueStateText("The PAN part of the GSTIN does not match the entered PAN.")}}else{t.setValueState("Error");t.setValueStateText("Invalid GSTIN format. Please enter a valid GSTIN.")}},onSubmitpan:function(){var e=this.byId("panInput");var a=e.getValue();if(e.getValueState()==="Success"){t.show("PAN Card number is valid: "+a)}else{t.show("Please enter a valid PAN Card number.")}},onSubmitgst:function(){var e=this.byId("gstinInput").getValue().trim();var a=this.getView().getModel("customerModel");var r=a.getProperty("/customers");var o=r.find(function(t){return t.GSTIN===e});if(o){var l=new sap.m.Dialog({title:"Customer Details",content:new sap.m.Text({text:"  Name: "+o.Name+"\n"+"  Address: "+o.Address+"\n"+"  Contact Number: "+o.ContactNumber}),beginButton:new sap.m.Button({text:"OK",press:function(){l.close()}}),afterClose:function(){l.destroy()}});l.open()}else{t.show("GSTIN not found!")}},onEmailChange:function(e){var t=e.getSource();var a=t.getValue();var r=/^[a-zA-Z0-9!#$%&'*+?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])$/;if(r.test(a)){t.setValueState("Success")}else{t.setValueState("Error");t.setValueStateText("Invalid Email format. Please enter a valid Email.")}},onSubmitemail:function(){var e=this.byId("emailInput");var a=e.getValue();if(e.getValueState()==="Success"){t.show("Email is valid: "+a)}else{t.show("Please enter a valid email address.")}},onNumberChange:function(e){var t=e.getSource();var a=t.getValue();a=a.replace(/\D/g,"");if(a.length>10){a=a.substring(0,10)}t.setValue(a);if(a.length===10){t.setValueState("Success")}else{t.setValueState("Error");t.setValueStateText("Invalid Number. Please enter a valid Mobile Number.")}},onSubmitnumber:function(){var e=this.byId("numberInput");var a=e.getValue();if(e.getValueState()==="Success"){t.show("Number is valid: "+a)}else{t.show("Please enter a valid Mobile number.")}},onDownload:function(e){var t=e.getSource();var a=t.getCustomData()[0].getValue();var r=t.getText();var o=document.createElement("a");o.href=a;o.download=r;document.body.appendChild(o);o.click();document.body.removeChild(o)},onDeleteFilepan:function(e){var a=e.getSource();var r=a.getParent().getParent();var o=this.getView().getModel();var l=o.getProperty("/pan");var s=r.getBindingContext().getPath().split("/").pop();l.splice(s,1);o.setProperty("/pan",l);t.show("File deleted successfully.")},onDeleteFilegst:function(e){var a=e.getSource();var r=a.getParent().getParent();var o=this.getView().getModel();var l=o.getProperty("/gst");var s=r.getBindingContext().getPath().split("/").pop();l.splice(s,1);o.setProperty("/gst",l);t.show("File deleted successfully.")},onFileUploadpan:function(e){var a=e.getSource();var r=a.oFileUpload.files[0];if(r){var o=r.name;var l=new FileReader;var s=this;l.onload=function(e){var a=e.target.result;var r=s.getView().getModel();var l=r.getProperty("/pan");l.push({fileName:o,fileUrl:a});r.setProperty("/pan",l);console.log("Updated /Pan attachment:",r.getProperty("/pan"));t.show("File "+o+" uploaded successfully.");r.refresh(true)};l.readAsDataURL(r)}},formatAttachmentButtonTextpan:function(e){if(e&&e.length>0){return"View Attachments ("+e.length+")"}else{return"View Attachments (0)"}},onOpenDialogpan:function(){if(!this._oPanDialog){this._oPanDialog=this.getView().byId("panDialog");if(!this._oPanDialog){this._oPanDialog=sap.ui.xmlfragment("com.sumo.supplieronboarding.view.fragment.uploadfile",this);this.getView().addDependent(this._oPanDialog)}}this._oPanDialog.open()},onCloseDialogpan:function(){if(this._oPanDialog){this._oPanDialog.close()}},onFormsubmit:function(){var e=this.getView();var a=this.getOwnerComponent().getModel();var r=true;var o={panattachment:e.byId("fileUploaderPan").getValue(),gstattachment:e.byId("fileUploaderGst").getValue()};var l={validity:e.byId("datePicker").getDateValue(),relatedParty:e.byId("radioGroup").getSelectedButton(),supplierSpendType:e.byId("supplierSpendType").getSelectedKey(),natureOfActivity:e.byId("NatureofActivity").getSelectedKey(),sector:e.byId("sectorComboBox").getSelectedKeys(),FunctionandSubfunction:e.byId("childMultiComboBox").getSelectedKeys(),panCardNumber:e.byId("panInput").getValue(),gstinNumber:e.byId("gstinInput").getValue(),supplierFullName:e.byId("SupplierNameInput").getValue(),supplierTradeName:e.byId("SuppliertradeNameInput").getValue(),supplierAddress:e.byId("SupplierAddressInput").getValue(),supplierGstAddress:e.byId("SupplierAddressgstInput").getValue(),primaryFirstName:e.byId("PrimaryFirstnameInput").getValue(),primaryLastName:e.byId("PrimaryLastnameInput").getValue(),primaryEmail:e.byId("emailInput").getValue(),primaryPhone:e.byId("numberInput").getValue()};if(!l.validity){e.byId("datePicker").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Date is required");r=false}else{e.byId("datePicker").setValueState(sap.ui.core.ValueState.None)}if(l.supplierSpendType.length===0){e.byId("supplierSpendType").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Supplier Spend Type is required");r=false}else{e.byId("supplierSpendType").setValueState(sap.ui.core.ValueState.None)}if(l.natureOfActivity.length===0){e.byId("NatureofActivity").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Nature of Activity is required");r=false}else{e.byId("NatureofActivity").setValueState(sap.ui.core.ValueState.None)}if(l.sector.length===0){e.byId("sectorComboBox").setValueState(sap.ui.core.ValueState.Error).setValueStateText("At least one sector is required.");r=false}else{e.byId("sectorComboBox").setValueState(sap.ui.core.ValueState.None)}if(l.FunctionandSubfunction.length===0){e.byId("childMultiComboBox").setValueState(sap.ui.core.ValueState.Error).setValueStateText("At least one function/subfunction is required.");r=false}else{e.byId("childMultiComboBox").setValueState(sap.ui.core.ValueState.None)}if(!l.panCardNumber){e.byId("panInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Number is required");r=false}else{e.byId("panInput").setValueState(sap.ui.core.ValueState.None)}if(!o.panattachment){e.byId("fileUploaderPan").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Attachment is required");r=false}else{e.byId("fileUploaderPan").setValueState(sap.ui.core.ValueState.None)}if(!o.gstattachment){e.byId("fileUploaderGst").setValueState(sap.ui.core.ValueState.Error).setValueStateText("PAN Card Attachment is required");r=false}else{e.byId("fileUploaderGst").setValueState(sap.ui.core.ValueState.None)}if(!l.gstinNumber){e.byId("gstinInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("GSTIN Number is required");r=false}else{e.byId("gstinInput").setValueState(sap.ui.core.ValueState.None)}if(!l.supplierFullName){e.byId("SupplierNameInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Supplier Full Name is required");r=false}else{e.byId("SupplierNameInput").setValueState(sap.ui.core.ValueState.None)}if(!l.supplierTradeName){e.byId("SuppliertradeNameInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Supplier trade Name is required");r=false}else{e.byId("SuppliertradeNameInput").setValueState(sap.ui.core.ValueState.None)}if(!l.supplierAddress){e.byId("SupplierAddressInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Supplier Address is required");r=false}else{e.byId("SupplierAddressInput").setValueState(sap.ui.core.ValueState.None)}if(!l.supplierGstAddress){e.byId("SupplierAddressgstInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Supplier Address gst is required");r=false}else{e.byId("SupplierAddressgstInput").setValueState(sap.ui.core.ValueState.None)}if(!l.primaryFirstName){e.byId("PrimaryFirstnameInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Primary First name is required");r=false}else{e.byId("PrimaryFirstnameInput").setValueState(sap.ui.core.ValueState.None)}if(!l.primaryLastName){e.byId("PrimaryLastnameInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Primary Last name is required");r=false}else{e.byId("PrimaryLastnameInput").setValueState(sap.ui.core.ValueState.None)}if(!l.primaryEmail){e.byId("emailInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Primary Email is required");r=false}else{e.byId("emailInput").setValueState(sap.ui.core.ValueState.None)}if(!l.primaryPhone){e.byId("numberInput").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Primary Phone Number is required");r=false}else{e.byId("numberInput").setValueState(sap.ui.core.ValueState.None)}if(r){if(l.relatedParty.getText()==="Yes"){l.relatedParty=true}else{l.relatedParty=false}var s={DigressionVendorCodeVal:l.validity,IsRelPartyVCode:l.relatedParty,SpendType:l.supplierSpendType,NatureOfActivity:l.natureOfActivity,Sector:l.sector,FunAndSubfun:l.FunctionandSubfunction,PANCardNo:l.panCardNumber,GSTIN:l.gstinNumber,SFullName:l.supplierFullName,STradeNameGST:l.supplierTradeName,SAddress:l.supplierAddress,SAddressGST:l.supplierGstAddress,PriContactFName:l.primaryFirstName,PriContactLName:l.primaryLastName,PriContactEmail:l.primaryEmail,PriContactMNumber:l.primaryPhone};a.setUseBatch(false);var e=this;a.create("/supplierReqSrv",s,{method:"POST",success:function(a){t.show("Form submitted successfully."+a.ID);console.log(a.ID);this.onUploadFile(a.ID);console.log("----------\x3eUpload");e.clearFormFields()}.bind(this),error:function(){t.show("Error while submitting the Form.")}})}else{sap.m.MessageToast.show("Please fill All The Required fields.")}},onUploadFile:function(e){console.log("On Upload file---------\x3e");const a=(e,a)=>{e.forEach(e=>{console.log("Control reached!!!");var r={Req_Supplier_ID:a,Doc_Type:"PAN",Attachment_ID:e.attachmentId,fileName:e.fileName,mediaType:e.fileType,content:e.fileContent,Doc_Type:e.Doc_Type};console.log(r);var o=this.getOwnerComponent().getModel();o.setUseBatch(false);o.create("/SReqattachmentsSrv",r,{method:"POST",success:function(e){t.show("Attachments uploaded successfully: "+e.ID)}.bind(this),error:function(){t.show("Error while Uploading the Attachments.")}})})};var r=this.getView().getModel();var o=r.getProperty("/documentFiles");console.log(o.pan);console.log(o.gst);var l=o.pan.concat(o.gst);console.log(l);console.log(`++++++++++ ${l}++++++++++`);a(l,e)},onFileUpload:function(e){var a=e.getSource();var r=a.getValue();var o=a.oFileUpload.files[0];if(r){a.setValueState(sap.ui.core.ValueState.None)}if(o){var l=o.name;var s=l.split(".").pop();var i=new FileReader;var n=this;i.onload=function(e){var r=e.target.result;console.log("Base64 File URL: ",r);var o=n.getView().getModel();var i=o.getProperty("/documentFiles")||{pan:[],gst:[],cin:[]};var u=i.pan.length+1;var d=i.gst.length+1;var p=i.cin.length+1;var c=a.getId();var g="";var m="";if(c.includes("fileUploaderPan")){g="PAN";m="PAN-"+u;i.pan.push({fileName:l,fileUrl:r,fileContent:r,fileType:s,Doc_Type:"PAN",attachmentId:m})}else if(c.includes("fileUploaderGst")){g="GST";m="GST-"+d;i.gst.push({fileName:l,fileUrl:r,fileContent:r,fileType:s,Doc_Type:"GST",attachmentId:m})}else if(c.includes("fileUploaderCin")){g="CIN";m="CIN-"+p;i.cin.push({fileName:l,fileUrl:r,fileContent:r,fileType:s,Doc_Type:"CIN",attachmentId:m})}o.setProperty("/documentFiles",i);console.log("Updated /documentFiles:",o.getProperty("/documentFiles"));t.show(g+" file "+l+" uploaded successfully.");o.refresh(true)};i.readAsDataURL(o)}},formatAttachmentButtonText:function(e,t){e=e||[];return"View Attachments ("+e.length+")"},onOpenDialog:function(e){if(!this._oDialog){this._oDialog=sap.ui.xmlfragment("com.sumo.supplieronboarding.view.fragment.uploadfile",this);this.getView().addDependent(this._oDialog)}var t=this.getView().getModel();var a=t.getProperty("/documentFiles/"+e)||[];var r=new sap.ui.model.json.JSONModel({documentFiles:a});this._oDialog.setModel(r);this._oDialog.data("documentType",e);this._oDialog.open()},onCloseDialog:function(){if(this._oDialog){this._oDialog.close()}},onDownloadFile:function(e){const a=e.getSource().data("fileName");const r=this._oDialog.data("documentType");var o=this.getView().getModel();var l=o.getProperty("/documentFiles/"+r);var s=l.find(e=>e.fileName===a);console.log("Selected File: ",s);if(s&&s.fileContent){const e=this._base64ToBlob(s.fileContent);const t=document.createElement("a");t.href=URL.createObjectURL(e);t.download=a;t.click()}else{t.show("File not found or missing content.")}},onDeleteFile:function(e){const a=e.getSource().data("fileName");const r=this._oDialog.data("documentType");sap.m.MessageBox.confirm(`Are you sure you want to delete the file "${a}"?`,{onClose:function(e){if(e==="OK"){const e=this.getView().getModel();const o=e.getProperty("/documentFiles/"+r);const l=o.filter(e=>e.fileName!==a);e.setProperty("/documentFiles/"+r,l);t.show(`File "${a}" deleted successfully.`);this.onCloseDialog()}}.bind(this)})},_base64ToBlob:function(e){if(e.startsWith("data:")){e=e.split(",")[1]}console.log("Base64 String: ",e);try{const t=atob(e);const a=[];for(let e=0;e<t.length;e+=512){const r=t.slice(e,e+512);const o=new Array(r.length);for(let e=0;e<r.length;e++){o[e]=r.charCodeAt(e)}const l=new Uint8Array(o);a.push(l)}return new Blob(a,{type:"application/octet-stream"})}catch(e){console.error("Base64 decoding failed: ",e);return null}},handleLiveChange:function(e){var t=e.getSource();var a=t.getValue();if(a){t.setValueState(sap.ui.core.ValueState.None)}},handleComboBoxChange:function(e){var t=e.getSource();var a=t.getSelectedKey();if(a){t.setValueState(sap.ui.core.ValueState.None)}},handleDateChange:function(e){var t=e.getSource();var a=t.getDateValue();if(a){t.setValueState(sap.ui.core.ValueState.None)}},handleFileChange:function(e){var t=e.getSource();var a=t.getValue();if(a){t.setValueState(sap.ui.core.ValueState.None)}},handleMultiComboBoxChange:function(e){var t=e.getSource();var a=t.getSelectedItems();if(a.length>0){t.setValueState(sap.ui.core.ValueState.None)}},clearFormFields:function(){var e=this.getView();e.byId("datePicker").setDateValue(null);e.byId("radioGroup").setSelectedButton(null);e.byId("supplierSpendType").setSelectedKey("");e.byId("NatureofActivity").setSelectedKey("");e.byId("sectorComboBox").setSelectedKeys([]);e.byId("childMultiComboBox").setSelectedKeys([]);e.byId("panInput").setValue("");e.byId("fileUploaderPan").setValue("");e.byId("fileUploaderGst").setValue("");e.byId("gstinInput").setValue("");e.byId("SupplierNameInput").setValue("");e.byId("SuppliertradeNameInput").setValue("");e.byId("SupplierAddressInput").setValue("");e.byId("SupplierAddressgstInput").setValue("");e.byId("PrimaryFirstnameInput").setValue("");e.byId("PrimaryLastnameInput").setValue("");e.byId("emailInput").setValue("");e.byId("numberInput").setValue("")},onReadSector:function(){console.log("I am sector srv");var e=this;var t=this.getOwnerComponent().getModel();t.read("/SectorSrv",{success:function(t){console.log(t);var a=new sap.ui.model.json.JSONModel(t);e.getView().byId("sectorComboBox").setModel(a)},error:function(e){console.log(e)}})},onReadNatureofActivity:function(){var e=this;var t=this.getOwnerComponent().getModel();t.read("/NatureOfActivitySrv",{success:function(t){console.log(t);var a=new sap.ui.model.json.JSONModel(t);e.getView().byId("NatureofActivity").setModel(a)},error:function(e){console.log(e)}})},onReadSupplierSpendType:function(){var e=this;var t=this.getOwnerComponent().getModel();t.read("/SupplierSpendTypeSrv",{success:function(t){console.log(t);var a=new sap.ui.model.json.JSONModel(t);e.getView().byId("supplierSpendType").setModel(a)},error:function(e){console.log(e)}})},onSave:function(){var e=this.getView();var a={validity:e.byId("datePicker").getDateValue(),relatedParty:e.byId("radioGroup").getSelectedButton().getText(),supplierSpendType:e.byId("supplierSpendType").getSelectedKey(),natureOfActivity:e.byId("NatureofActivity").getSelectedKey(),sector:e.byId("sectorComboBox").getSelectedKeys().join(", "),FunctionandSubfunction:e.byId("childMultiComboBox").getSelectedKeys(),panCardNumber:e.byId("panInput").getValue(),gstinNumber:e.byId("gstinInput").getValue(),supplierFullName:e.byId("SupplierNameInput").getValue(),supplierTradeName:e.byId("SuppliertradeNameInput").getValue(),supplierAddress:e.byId("SupplierAddressInput").getValue(),supplierGstAddress:e.byId("SupplierAddressgstInput").getValue(),primaryFirstName:e.byId("PrimaryFirstnameInput").getValue(),primaryLastName:e.byId("PrimaryLastnameInput").getValue(),primaryEmail:e.byId("emailInput").getValue(),primaryPhone:e.byId("numberInput").getValue()};var r=JSON.stringify(a);localStorage.setItem("formData",r);console.log(a);t.show("Form data saved successfully in local storage.")},onReadDepartments:function(){var e=this;var t=this.getOwnerComponent().getModel();t.read("/departmentsSrv",{success:function(t){console.log("Departments Data:",t);var a=new sap.ui.model.json.JSONModel(t);e.getView().setModel(a,"departmentsModel");var r=e.getView().byId("FunctionandSubfunctionComboBox");var o=r.getItems();if(o&&o.length>0){r.setSelectedItem(o[0]);e.onDepartmentChange({getParameter:function(){return o[0]}})}},error:function(e){console.log("Error fetching departments data:",e)}})},onDepartmentChange:function(e){var t=this;var a=e.getParameter("selectedItem");console.log("Selected Item:",a);if(a){var r=a.getBindingContext("departmentsModel").getObject();console.log("Selected Department:",r);if(r.Functions&&r.Functions.length>0){console.log("Functions:",r.Functions);var o=new sap.ui.model.json.JSONModel({Functions:r.Functions});t.getView().byId("childMultiComboBox").setModel(o,"functionsModel")}else{console.log("No functions available for the selected department.")}}}})});
//# sourceMappingURL=RequestForm.controller.js.map