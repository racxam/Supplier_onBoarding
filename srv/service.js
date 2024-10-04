module.exports = async function () {

    const { supplierReqSrv, SavingsupplierReqSrv } = this.entities;

    this.before('CREATE', 'SReqattachmentsSrv', async (req) => {




        if (req.data.content && req.data.content.length > 0) {
            console.log("Uploading file of size:", req.data.content.length);
        }

        req.data.url = `/odata/v2/attachments/SReqattachmentsSrv(${req.data.ID})/content`;
    });

    this.after('CREATE', 'SReqattachmentsSrv', (req) => {

        console.log("File successfully uploaded!");
    });

    this.before('CREATE', supplierReqSrv, BeforeSupReqFun);
    this.before('CREATE', SavingsupplierReqSrv, BeforeSavingSupReqFun);
    this.after('CREATE', supplierReqSrv, AfterSupReqFun);

    // functions
    //1. Before supplier req form
    async function BeforeSupReqFun(req, res) {


        const {
            DigressionVendorCodeVal,
            IsRelPartyVCode,
            SpendType,
            NatureOfActivity,
            Sector,
            FunAndSubfun,
            PANCardNo,
            GSTIN,
            SFullName,
            STradeNameGST,
            SAddress,
            SAddressGST,
            PriContactFName,
            PriContactLName,
            PriContactEmail,
            PriContactMNumber,
            Status
        } = req.data;

        const mandatoryFields = {
            DigressionVendorCodeVal,
            IsRelPartyVCode,
            SpendType,
            NatureOfActivity,
            Sector,
            FunAndSubfun,
            PANCardNo,
            GSTIN,
            SFullName,
            STradeNameGST,
            SAddress,
            SAddressGST,
            PriContactFName,
            PriContactLName,
            PriContactEmail,
            PriContactMNumber,

        };


        const missingFields = Object.keys(mandatoryFields).filter(field => !mandatoryFields[field] || mandatoryFields[field].length === 0);
        if (missingFields.length) {
            req.error(400, `Following field must be provided :${missingFields.join(', ')}`);

        }
        //function call
        await ValCheck(DigressionVendorCodeVal, GSTIN, PANCardNo, req);



    };


    //2. Before supplier saving form
    async function BeforeSavingSupReqFun(req, res) {
        const {
            DigressionVendorCodeVal,
            PANCardNo,
            GSTIN,
        } = req.data;

        await ValCheck(DigressionVendorCodeVal, GSTIN, PANCardNo, req);

    }

    //After supplier Req Fun We are triggering the workflow
    async function AfterSupReqFun(req, res) {

        const {
           
            SFullName,
           
        } = res.data;
        let ReqID=res.id;
        console.log(ReqID);

        try {


            const apprwf = await cds.connect.to("workflow");

            let workflowData=JSON.stringify({
                "definitionId": "us10.fd8df7c4trial.vihaanworkflow.approvalProcess",
                "context": {
                    "ReqID": ReqID,
                    "SFullName":SFullName,
                    "ApproverEmail":"sumitracxam@gmail.com"
                   
                }
             });
             console.log(workflowData);

            const wfResponse = await apprwf.send({
                method: 'POST',
                path: "/workflow/rest/v1/workflow-instances",
                data: workflowData,
                headers: {
                    'Content-Type': 'application/json'
                }

            });

            console.log('Workflow Triggered', wfResponse);
        } catch (error) {
            console.error('Workflow Trigger Error:', error);
            throw error;
        }
    }
};


// service end
async function ValCheck(DigressionVendorCodeVal, GSTIN, PANCardNo, req) {
    const currentDate = new Date();

    const afterFourYearDate = new Date();
    afterFourYearDate.setFullYear(currentDate.getFullYear() + 4);

    const ValdityDate = new Date(DigressionVendorCodeVal);

    if (ValdityDate < currentDate) {
        req.error(400, "Validity Digression Date must be Greater than Current Date");

    }
    if (ValdityDate > afterFourYearDate) {
        req.error(400, 'Validity Digression Date can not be more than Four Years')

    }

    const GSTIN_match = GSTIN.substring(2, 12);
    if (GSTIN_match !== PANCardNo) {

        req.error(400, "GST's digits from 3 to 10 should exactly match!!");
    }


}