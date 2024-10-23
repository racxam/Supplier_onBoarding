// const axios= require('axios');
const SapCfAxios = require('sap-cf-axios').default;
// the destination that we want to use is named 'DUMMY'
const axios = SapCfAxios('GstApi');

module.exports = async function () {


    // Vihaan Entities-------------------------------------------->
    const { supplierReqSrv, SavingsupplierReqSrv, SReqattachmentsSrv} = this.entities;

    const GstApi = await cds.connect.to('GstApi');

    // Attachments-------------------------------------------->
    this.before('CREATE', SReqattachmentsSrv, BeforeAttachmentUpload);
    this.on('CREATE', SReqattachmentsSrv, OnAttachmentsUpload);
    // request atttachments
    this.before('CREATE', supplierReqSrv, BeforeSupReqFun);
    this.before('CREATE', SavingsupplierReqSrv, BeforeSavingSupReqFun);
    this.on('CREATE', SavingsupplierReqSrv,OnSavingSupReqFun)
    this.after('CREATE', supplierReqSrv, AfterSupReqFun);

    this.on('getStatus', onGSTValidation);


    // functions-------------------------------------------->
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
        console.log("REQID" + req.ID);


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

    };

    async function OnSavingSupReqFun(req,res){
        console.log(req.data);
        req.data.Status='DRAFT'
        console.log(req.data);
         await cds.tx(req).run([
            INSERT.into(SavingsupplierReqSrv).entries(req.data)

        ]).then((resolve, reject) => {
            if (typeof (resolve) !== 'undefined') {
                return req.data;
            } else {
                req.error(500, 'There is an error on Saving the Supplier Request Form');
            }
        }).catch(err => {
            console.log(err);
            req.error(500, "There is an error " + err.toString());
        })
        return req.data;



    };

    //After supplier Req Fun We are triggering the workflow
    async function AfterSupReqFun(req, res) {

        const {

            SFullName,

        } = res.data;
        let ReqID = res.data.ID;

        try {


            const apprwf = await cds.connect.to("spa_process_destination");

            let workflowData = JSON.stringify({
                "definitionId": "us10.fd8df7c4trial.vihaanworkflow.approvalProcess",
                "context": {
                    "reqid": ReqID,
                    "approveremail": "sumitracxam@gmail.com",
                    "sfullname": SFullName

                }
            });
            console.log(workflowData);

            const wfResponse = await apprwf.post('/workflow-instances', workflowData, {
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

    //On Attachment Upload...
    async function OnAttachmentsUpload(req, res) {
        const { content: base64Content, ...rest } = req.data;
        if (base64Content) {
            const binaryContent = Buffer.from(base64Content.split(',')[1], 'base64');
            rest.content = binaryContent;
        }
        await INSERT.into(SReqattachmentsSrv).entries(rest);

        return req.data;

    }

    //Before Attachment Upload
    async function BeforeAttachmentUpload(req, res) {

        if (req.data.content && req.data.content.length > 0) {
            console.log("Uploading file of size:", req.data.content.length);
        }
        req.data.url = `/odata/v2/attachments/SReqattachmentsSrv(${req.data.ID})/content`;

    }

    async function onGSTValidation(req, res) {
        console.log(GstApi);
        try {
            const response = await axios.get('?email=vikrant.raj@gmail.com&gstin=33GSPTN1351G1ZF', {
                headers: {
                    'client_id': '169e8939-4d76-4230-b4c5-935f3f4453ce',
                    'client_secret': '51c2ad52-03db-4731-a660-af9131b42d6d',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error calling GST API:', error);
            return false;
        }

    }
};


// service end
async function ValCheck(DigressionVendorCodeVal, GSTIN, PANCardNo, req) {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate);


    const afterFourYearDate = new Date();
    afterFourYearDate.setFullYear(currentDate.getFullYear() + 4);
    afterFourYearDate.setHours(0, 0, 0, 0);
    console.log(afterFourYearDate);


    const ValdityDate = new Date(DigressionVendorCodeVal);
    ValdityDate.setHours(0, 0, 0, 0);
    console.log(ValdityDate);
    console.log(DigressionVendorCodeVal);

    if (ValdityDate < currentDate) {
        req.error(400, "Validity Digression Date must be greater than the current date");
    }
    if (ValdityDate > afterFourYearDate) {
        req.error(400, 'Validity Digression Date cannot be more than four years');
    }


    const GSTIN_match = GSTIN.substring(2, 12);
    if (GSTIN_match !== PANCardNo) {
        req.error(400, "GST's digits from 3 to 10 should exactly match!!");
    }
}
