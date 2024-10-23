sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("com.sumo.supplieronboarding.controller.RegistrationForm", {
            onInit: function () {
                // Initialize the model with an empty array for files
                var oModel = new sap.ui.model.json.JSONModel({ documentfiles: [] });
                this.getView().setModel(oModel);
                // You can load the fragment during initialization or as needed (e.g., in an event)
                this._loadMyFragment();
            },
            _loadMyFragment: function () {
                // Dynamically load the fragment
                this.loadFragment({
                    name: "com.sumo.supplieronboarding.view.fragment.uploadfiles"
                }).then(function (oFragment) {
                    // Add the fragment content to a container in View1 (e.g., VBox)
                    this.byId("fileListFragment2").addItem(oFragment);
                }.bind(this));
            },
            // Function to open the dialog when clicking the button  ****
            onOpenDialog: function () {
                var oView = this.getView();
                var oDialog = oView.byId("fileUploadDialog");

                // Open the dialog
                oDialog.open();
            },

            // Function to close the dialog
            onCloseDialog: function () {
                var oDialog = this.getView().byId("fileUploadDialog");

                // Close the dialog
                oDialog.close();
            },

            // Handle file change event
            onFileChange: function (oEvent) {
                var aFiles = oEvent.getParameter("files");
                if (aFiles.length > 0) {
                    // Handle the selected file
                    console.log("Selected file: " + aFiles[0].name);
                }
            },

            // Handle upload completion
            onUploadComplete: function (oEvent) {
                // Get the response
                var response = oEvent.getParameter("response");
                console.log("Upload complete. Response: ", response);
            },

            // Optionally, handle the upload button click
            onUploadFile: function () {
                var oUploader = this.getView().byId("fileUploader");
                oUploader.upload();
            },
            onAfterItemAdded: function (oEvent) {
                var item = oEvent.getParameter("item")
                this._createEntity(item)
                    .then((id) => {
                        this._uploadContent(item, id);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },

            onUploadCompleted: function (oEvent) {
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.removeAllIncompleteItems();
                oUploadSet.getBinding("items").refresh();
            },

            onOpenPressed: function (oEvent) {
                oEvent.preventDefault();
                var item = oEvent.getSource();
                this._fileName = item.getFileName();
                this._download(item)
                    .then((blob) => {
                        var url = window.URL.createObjectURL(blob);
                        // //open in the browser
                        // window.open(url);

                        //download
                        var link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', this._fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            },

            _createEntity: function (item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size
                };

                var settings = {
                    url: "/odata/v4/attachments/Files",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                }

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((results, textStatus, request) => {
                            resolve(results.ID);
                        })
                        .fail((err) => {
                            reject(err);
                        })
                })
            },

            _uploadContent: function (item, id) {
                var url = `/odata/v4/attachments/Files(${id})/content`
                item.setUploadUrl(url);
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.setHttpRequestMethod("PUT")
                oUploadSet.uploadItem(item);
            },



            // Function to open the dialog when clicking the button
            onOpenDialog: function () {
                var oView = this.getView();
                var oDialog = oView.byId("fileUploadDialog");

                // Open the dialog
                oDialog.open();
            },

            // Function to close the dialog
            onCloseDialog: function () {
                var oDialog = this.getView().byId("fileUploadDialog");

                // Close the dialog
                oDialog.close();
            },

            // Handle file change event
            onFileChange: function (oEvent) {
                var aFiles = oEvent.getParameter("files");
                if (aFiles.length > 0) {
                    // Handle the selected file
                    console.log("Selected file: " + aFiles[0].name);
                }
            },

            // Handle upload completion
            onUploadComplete: function (oEvent) {
                // Get the response
                var response = oEvent.getParameter("response");
                console.log("Upload complete. Response: ", response);
            },

            // Optionally, handle the upload button click
            onUploadFile: function () {
                var oUploader = this.getView().byId("fileUploader");
                oUploader.upload();
            },
            handleUploadPress: function (oEvent) {
                var oFileUploader = this.getView().byId("fileUploader");
                oFileUploader.upload();
            },
            onFileUpload: function (oEvent) {
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
                        var aFiles = oModel.getProperty("/documentfiles");  // Get current documentfiles array

                        aFiles.push({
                            fileName: sFileName,
                            fileUrl: sFileUrl
                        });

                        // Update the model with the new file
                        oModel.setProperty("/documentfiles", aFiles);

                        // Log updated /files data to console
                        console.log("Updated /documentfiles array:", oModel.getProperty("/documentfiles"));

                        // Show success message
                        MessageToast.show("File " + sFileName + " uploaded successfully.");

                        oModel.refresh(true);
                    };

                    oReader.readAsDataURL(oFile);  // Read the file as Data URL (base64)
                }
            },
            formatAttachmentButtonText: function (aDocumentFiles) {
                if (aDocumentFiles && aDocumentFiles.length > 0) {
                    return "View Attachments (" + aDocumentFiles.length + ")";
                } else {
                    return "View Attachments (0)";
                }
            },

            onOpenDialog: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.sumo.supplieronboarding.view.fragment.uploadfile", this);
                    this.getView().addDependent(this._oDialog);
                }
                this._oDialog.open();
            },

            onCloseDialog: function () {
                this._oDialog.close();
            },

            onDownloadFile: function (oEvent) {
                const sFileName = oEvent.getSource().data("fileName");

                // Logic to fetch and download the file from backend
                this.getView().getModel().read(`/documentfiles('${sFileName}')/fileContent`, {
                    success: function (oData) {
                        const fileContent = oData.fileContent; // assuming it's base64 encoded

                        // Create a blob and trigger download
                        const blob = this._base64ToBlob(fileContent);
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = sFileName;
                        link.click();
                    }.bind(this),
                    error: function () {
                        MessageToast.show("Failed to download file");
                    }
                });
            },

            onDeleteFile: function (oEvent) {
                const sFileName = oEvent.getSource().data("fileName");

                // Confirm and delete file
                sap.m.MessageBox.confirm(`Are you sure you want to delete the file "${sFileName}"?`, {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            // Call the backend to delete the file
                            this.getView().getModel().remove(`/documentfiles('${sFileName}')`, {
                                success: function () {
                                    MessageToast.show(`File "${sFileName}" deleted successfully.`);
                                    this.getView().getModel().refresh();
                                }.bind(this),
                                error: function () {
                                    MessageToast.show("Failed to delete file");
                                }
                            });
                        }
                    }.bind(this)
                });
            },

            // Utility function to convert base64 to blob
            _base64ToBlob: function (base64) {
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
            },
            //    ######## validation form2
            // #############CIN Number Validation
            onValidateCIN: function () {
                // Get the CIN input from the view
                var oInput = this.getView().byId("cinInput");
                var cinValue = oInput.getValue();

                // Regular expression pattern for CIN validation
                var cinPattern = /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;

                // Test the CIN value against the pattern
                if (cinPattern.test(cinValue)) {
                    // If valid, show success message
                    sap.m.MessageToast.show("Valid CIN Number");
                } else {
                    // If invalid, show error message and set input as error
                    sap.m.MessageToast.show("Invalid CIN Number");
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                }
            },
            // ###############EPFO Number Validation
            onValidateEPFONumber: function () {
                // Get the EPFO input from the view
                var oInput = this.getView().byId("epfoInput");
                var epfoValue = oInput.getValue();

                // Regular expression pattern for EPFO number validation
                var epfoPattern = /^([A-Z]{2})\s([A-Z]{3})\s([0-9]{7})\s([0-9]{3})\s([0-9]{7})$/;

                // Test the EPFO number against the pattern
                if (epfoPattern.test(epfoValue)) {
                    // If valid, show success message
                    sap.m.MessageToast.show("Valid EPFO Number");
                    oInput.setValueState(sap.ui.core.ValueState.Success);
                } else {
                    // If invalid, show error message and set input as error
                    sap.m.MessageToast.show("Invalid EPFO Number");
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                }
            },
            // ############### DUNS Number Validation
            onValidateDUNSNumber: function () {
                // Get the DUNS input from the view
                var oInput = this.getView().byId("dunsInput");
                var dunsValue = oInput.getValue();

                // Regular expression pattern for DUNS number validation
                var dunsPattern = /^\d{9}$/;

                // Test the DUNS number against the pattern
                if (dunsPattern.test(dunsValue)) {
                    // If valid, show success message
                    sap.m.MessageToast.show("Valid DUNS Number");
                    oInput.setValueState(sap.ui.core.ValueState.Success);
                } else {
                    // If invalid, show error message and set input as error
                    sap.m.MessageToast.show("Invalid DUNS Number");
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                }
            },
            // ############### LEI Number Validation
            onValidateLEINumber: function () {
                // Get the LEI input from the view
                var oInput = this.getView().byId("leiInput");
                var leiValue = oInput.getValue();

                // Regular expression pattern for LEI number validation
                var leiPattern = /^[A-Z0-9]{4}00[A-Z0-9]{14}$/;

                // Test the LEI number against the pattern
                if (leiPattern.test(leiValue)) {
                    // If valid, show success message
                    sap.m.MessageToast.show("Valid LEI Number");
                    oInput.setValueState(sap.ui.core.ValueState.Success);
                } else {
                    // If invalid, show error message and set input as error
                    sap.m.MessageToast.show("Invalid LEI Number");
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                }
            },


            // ###########OData database CRUD Operation
            SubmitSupplieronBoardForm: function () // FOR CREATING NEW RECORD ************
            {
                var UserName = sap.ui.getCore().byId('_IDGenInput2').getValue()
                var UserSalary = parseInt(sap.ui.getCore().byId('_IDGenInput3').getValue())
                var UserId = parseInt(sap.ui.getCore().byId('_IDGenInput1').getValue())
                var UserAge = parseInt(sap.ui.getCore().byId('_IDGenInput4').getValue())
                var UserCity = sap.ui.getCore().byId('_IDGenInput5').getValue()

                var oAddEmpData = {}
                oAddEmpData.Name = UserName
                oAddEmpData.Salary = UserSalary
                oAddEmpData.Id = UserId
                oAddEmpData.Age = UserAge
                oAddEmpData.City = UserCity
                this.getView().getModel().create("/ZUSERDATASet", oAddEmpData, {
                    method: "POST",
                    success: function (data) {
                        MessageToast.show("Employee Created Successfully");
                    },
                    error: function (data) {
                        MessageToast.show(data);
                    },
                });
            }



        });
    });