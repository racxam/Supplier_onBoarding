using Attachments as service from '../../srv/service';
annotate Attachments.supplierReqSrv with @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: SupplierId,
        Label: 'Supplier ID' // Optional: Add label if needed
    },
    {
        $Type: 'UI.DataField',
        Value: SFullName,
        Label: 'Supplier Full Name'
    },
    {
        $Type: 'UI.DataField',
        Value: SpendType,
        Label: 'Spend Type'
    },
    {
        $Type: 'UI.DataField',
        Value: PriContactEmail,
        Label: 'Primary Contact Email'
    },
    {
        $Type: 'UI.DataField',
        Value: Status,
        Label: 'Status'
    }
]});