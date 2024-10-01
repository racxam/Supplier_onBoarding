namespace dbmedia;

using {
    cuid,
    managed
} from '@sap/cds/common';

using {common.db as common} from './master';

context transcation {

    entity supplier_request : cuid, managed, {

        UserId                  : String; // req.user.id
        DigressionVendorCodeVal : Date; //"Type of vendor code creation request" = "Digression vendor code"
        IsRelPartyVCode         : Boolean; //Mandatory, visible when "Supplier Type" = "Local GST & Non-GST"
        SpendType               : common.SpendTypeT; // Mandatory, visible when "Supplier Type" = "Local GST & Non-GST"
        NatureOfActivity        : common.NatureOfActivityT;
        Sector                  : array of common.SectorT; //more than one value
        FunAndSubfun            : array of String(100); // we will modify this later on
        PANCardNo               : common.PanCardT;
        GSTIN                   : common.GstInT; //gst no.
        Attachments             : Association to many sreq_attachments
                                      on Attachments.Req_Supplier = $self;
        SFullName               : String(100); // Supplier Full Legal Name
        STradeNameGST           : String(100); // Supplier Trade Name (GST)
        SAddress                : String(255); // Supplier Address
        SAddressGST             : String(255); // Supplier Address (GST)

        PriContactFName         : String(50); // Primary Contact First Name
        PriContactLName         : String(50); // Primary Contact Last Name
        PriContactEmail         : String(64); // It needs validation
        PriContactMNumber       : String(15); // Needs validation
        Status                  : common.StatusT default 'PENDING'; //Status


    };

    entity sreq_attachments : managed {

       key Req_Supplier  : Association to supplier_request;
       key Doc_Type      : common.attachmentT;
       key Attachment_ID : Int16;
        image         : LargeBinary @Core.MediaType: imageType;
        imageType     : String      @Core.IsMediaType;


    };

    entity sonboard_attachments : cuid, managed {

        OnBoarding_Supplier : Association to supplier_on_boarding;
        Doc_Type            : common.attachmentT;
        Attachment_ID       : Int16;
        image               : LargeBinary @Core.MediaType: imageType;
        imageType           : String      @Core.IsMediaType;


    };

    entity supplier_on_boarding : cuid, managed {
        SupplierReqID           : Association to supplier_request;
        GSTINType               : common.GSTINTypeT; // GSTIN Type
        Attachments             : Association to many sonboard_attachments
                                      on Attachments.OnBoarding_Supplier = $self;

        EInvoiceApplicability   : Boolean; // E-Invoice Applicability
        GSTRFiler               : common.GSTRFilerT; // GSTR-3B / GSTR-1 Filer
        SOrgType                : common.SupplierOrganizationTypeT; // Supplier Organization Type

        CINNumber               : common.CINNumberT; // CIN No. (Corporate or Company Identification No.)
        RegTaxID                : String(100); // Registration / Tax ID

        TANNumber               : String(100); // TAN Number
        EPFONumber              : String(20); // EPFO Number

        DUNSNumber              : common.DUNSNumberT; // DUNS Number
        LEINumber               : String(20); // LEI Number

        MainTelNumber           : String(20); // Main Telephone Number
        UDYAMNumber             : String(20);
        // UDYAM Number (If MSME is Yes)
        IndustryType            : common.IndustryTypeT;
        // Type of Industry
        MSMEType                : common.MSMETypeT;
        // MSME Certificate
        CountryCode             : String(2);
        @mandator // ISO/TS 9001 Certificate
        ISOTS9001CertNo         : String(100); // ISO/TS 9001 Certificate Number

        ISOTS9001ExpDate        : DateTime; // ISO/TS 9001 Certificate Expiry Date

        ISO16949CertNo          : String(64);
        ISO16949ExpDate         : DateTime;
        // ISO 14001 Certificate
        ISO14001CertNo          : String(100);
        // ISO 14001 Certificate Number
        ISO14001ExpDate         : DateTime;
        // ISO 45001 Certificate
        ISO45001CertNo          : String(100);
        // ISO 45001 Certificate Number
        ISO45001ExpDate         : DateTime;
        // Factory License
        FactoryLicenseNo        : String(100);
        // Factory License Number
        FactoryLicenseExpDate   : DateTime;
        // Factory License Expiry Date

        ConsentToOperateCert    : String(255);
        // Consent to Operate Certificate
        ConsentToOperateCertNo  : String(100);
        // Consent to Operate Certificate Number
        ConsentToOperateExpDate : DateTime;
        // Fire NOC Certificate
        FireNOCCertNo           : String(100);
        // Fire NOC Certificate Number
        FireNOCCertExpDate      : Date;
        // Fire NOC Certificate Expiry Date


        WageAgreementCert       : String(255);
        // Wage Agreement Certificate
        WageAgreementCertNo     : String(100);
        // Wage Agreement Certificate Number
        WageAgreementExpDate    : Date;
        // Wage Agreement Certificate Expiry Date

        ///end of certificates

        PaymentTerms            : String(255);
        // Payment Terms
        IncotermsCode           : common.IncotermsCodeT; // Incoterms Code
        IncotermsLocation       : String(255); // Incoterms Location explained 2
        SupplierFullLegalName   : String(100);
        BankCountry             : String(2);
        // Bank Country
        BankName                : String(255);
        // Bank Name
        BankKey                 : String(11);
        // Bank Key (IFSC Code)
        IBANCode                : String(34); // IBAN Code / SWIFT Code --- non india
        BankStreetAdd           : String(255);
        // Bank Street Address
        BankAccountNo           : String(34);
        // Bank Account Number
        ReConfirmBankAccNo      : String(34);
        // Re-confirm Bank Account Number
        BankAccType             : common.BankAccountTypeT;
        // Bank Account Type
        PostalCode              : String(10);
        // Postal Code
        City                    : String(100);
        // City / Village
        BranchName              : String(100);
        // Branch Name
        State                   : common.StateChoiceT;
        // State
        RegionCode              : String(3); // Region Code for Foreign Account
        Status                  : common.StatusT default 'PENDING';

    }


}