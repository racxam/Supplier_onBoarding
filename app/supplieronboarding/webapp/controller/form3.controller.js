sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.sumo.supplieronboarding.controller.form3", {
            onInit: function () {
                  // Initialize the model with an empty array for files
                  var oModel = new sap.ui.model.json.JSONModel({ documentfiles: [] });
                  this.getView().setModel(oModel);
   
                  this.onReadform();
                  this.onReadAttachments();
            },
           
            onReadform: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();  
                var oFilter = new sap.ui.model.Filter('ID', 'EQ', '4a5c6461-e13d-4aa2-b645-c68296fe654b');  
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
            // onReadAttachments:function(){
            //     // SReqattachmentsSrv
            //     var that = this;
            //     var oModel = this.getOwnerComponent().getModel();  
            //     var oFilter = new sap.ui.model.Filter('Req_Supplier_ID', 'EQ', '4a5c6461-e13d-4aa2-b645-c68296fe654b');  
            //     // Read the OData service and fetch data
            //     oModel.read("/SReqattachmentsSrv", {
            //         filters: [oFilter],
            //         success: function (oData) {
            //             console.log("my form data", oData);
                       
            //             // Check if results array exists and has data
            //             if (oData && oData.results && oData.results.length > 0) {
            //                 // Set the model with the first result object
            //                 var attachments=oData.results;
            //                 console.log("hello-gunjan",attachments);
 
            //                 var jModel = new sap.ui.model.json.JSONModel(attachments);
            //                 var localModel=that.getView().getModel();
 
 
            //                 var oModel = that.getView().getModel();
            //                 var oDocumentFiles = oModel.getProperty("/documentFiles") || { pan: [], gst: [], cin: [] };  // Initialize documentFiles object
            //                 oDocumentFiles.pan=[...attachments.filter(att=>att.Doc_Type==='PAN')];
            //                 oDocumentFiles.gst=[...attachments.filter(att=>att.Doc_Type==='GST')];
 

            //                    // Set the documentFiles object to the JSON model
            //      jModel.setData({ 
            //         documentFiles: oDocumentFiles,
            //         Enabled: true,          // Set based on your logic
            //         Editable: true,         // Set based on your logic
            //         selectedPanFile: "id1"  // Set based on your logic
            //     });

            //                 // Update the model with the new document files
            //                  oModel.setProperty("/documentFiles", oDocumentFiles);
            //                  console.log("Updated /documentFiles:", oModel.getProperty("/documentFiles"));
 
 
                        
            //                 console.log("my form data request submit", jModel);
            //             }
            //              else {
            //                 console.warn("No data found in results.");
            //             }
            //         },
            //         error: function (oError) {
            //             console.error("Error fetching data", oError);
            //         }  
            //     });
            // }
            onReadAttachments: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();  
                var oFilter = new sap.ui.model.Filter('Req_Supplier_ID', 'EQ', '4a5c6461-e13d-4aa2-b645-c68296fe654b');  
                
                // Read the OData service and fetch data
                oModel.read("/SReqattachmentsSrv", {
                    filters: [oFilter],
                    success: function (oData) {
                        console.log("my form data", oData);
                       
                        if (oData && oData.results && oData.results.length > 0) {
                            var attachments = oData.results;
                            console.log("hello-gunjan", attachments);
            
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            var oDocumentFiles = {
                                pan: attachments.filter(att => att.Doc_Type === 'PAN'),
                                gst: attachments.filter(att => att.Doc_Type === 'GST'),
                                cin: attachments.filter(att => att.Doc_Type === 'CIN') // Adjust as needed
                            };
            
                            // Set the documentFiles object to the JSON model
                            oJSONModel.setData({ 
                                documentFiles: oDocumentFiles,
                                Enabled: true,          // Set based on your logic
                                Editable: true,         // Set based on your logic
                                selectedPanFile: "id1"  // Set based on your logic
                            });
            
                            // Set the JSON model to the view with the name "localModel"
                            that.getView().setModel(oJSONModel, "localModel");
                            console.log("Updated /documentFiles:", oJSONModel.getData().documentFiles);
                        } else {
                            console.warn("No data found in results.");
                        }
                    },
                    error: function (oError) {
                        console.error("Error fetching data", oError);
                    }  
                });
            }
            
        });
    });